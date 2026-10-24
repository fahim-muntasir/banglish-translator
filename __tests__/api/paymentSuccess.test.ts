/**
 * @jest-environment node
 */

const mockPaymentRef = { get: jest.fn() };
const mockUserRef = {};
const mockTransaction = {
  get: jest.fn(),
  update: jest.fn(),
};
const mockAdminDb = {
  collection: jest.fn((name: string) => ({
    doc: jest.fn(() =>
      name === "paymentTransactions" ? mockPaymentRef : mockUserRef,
    ),
  })),
  runTransaction: jest.fn(
    (callback: (transaction: typeof mockTransaction) => Promise<unknown>) =>
      callback(mockTransaction),
  ),
};

jest.doMock("@/lib/firebaseAdmin", () => ({ adminDb: mockAdminDb }));
const { POST } = jest.requireActual<
  typeof import("@/app/api/payment/success/route")
>("@/app/api/payment/success/route");

const transactionId = "BL0123456789abcdef01234567";
const validationId = "VALIDATION-1";
const payment = {
  uid: "test-user",
  plan: "PRO",
  amount: 999,
  status: "PENDING",
};
let mockPaymentStatus = "PENDING";

function callbackRequest(fields: Record<string, string>) {
  return new Request("https://app.example/api/payment/success", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  });
}

describe("payment success callback", () => {
  const originalStoreId = process.env.SSLCOMMERZ_STORE_ID;
  const originalStorePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SSLCOMMERZ_STORE_ID = "test-store";
    process.env.SSLCOMMERZ_STORE_PASSWORD = "test-password";
    process.env.NEXT_PUBLIC_APP_URL = "https://app.example";
    mockPaymentStatus = "PENDING";
    mockPaymentRef.get.mockResolvedValue({
      exists: true,
      data: () => ({ ...payment, status: mockPaymentStatus }),
    });
    mockTransaction.get.mockImplementation(async (reference) =>
      reference === mockPaymentRef
        ? {
            exists: true,
            data: () => ({ ...payment, status: mockPaymentStatus }),
          }
        : { exists: true, data: () => ({ isBlocked: false }) },
    );
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "VALID",
        tran_id: transactionId,
        val_id: validationId,
        amount: "999.00",
        currency: "BDT",
      }),
    }) as jest.Mock;
  });

  afterEach(() => {
    if (originalStoreId === undefined) delete process.env.SSLCOMMERZ_STORE_ID;
    else process.env.SSLCOMMERZ_STORE_ID = originalStoreId;
    if (originalStorePassword === undefined) {
      delete process.env.SSLCOMMERZ_STORE_PASSWORD;
    } else {
      process.env.SSLCOMMERZ_STORE_PASSWORD = originalStorePassword;
    }
    if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("does not trust a browser-submitted success status", async () => {
    const response = await POST(
      callbackRequest({ status: "VALID", tran_id: transactionId }),
    );

    expect(response.status).toBe(303);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockPaymentRef.get).not.toHaveBeenCalled();
    expect(mockTransaction.update).not.toHaveBeenCalled();
  });

  it("validates the gateway payment before atomically activating the plan", async () => {
    const response = await POST(
      callbackRequest({ tran_id: transactionId, val_id: validationId }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("success=true");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockTransaction.update).toHaveBeenCalledTimes(2);
    expect(mockTransaction.update).toHaveBeenCalledWith(
      mockUserRef,
      expect.objectContaining({
        plan: "PRO",
        "usage.count": 0,
      }),
    );
    expect(mockTransaction.update).toHaveBeenCalledWith(
      mockPaymentRef,
      expect.objectContaining({
        status: "PAID",
        validationId,
      }),
    );
  });

  it("treats repeated callbacks for a paid transaction as idempotent", async () => {
    mockPaymentStatus = "PAID";

    const response = await POST(
      callbackRequest({ tran_id: transactionId, val_id: validationId }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("success=true");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockAdminDb.runTransaction).not.toHaveBeenCalled();
    expect(mockTransaction.update).not.toHaveBeenCalled();
  });
});
