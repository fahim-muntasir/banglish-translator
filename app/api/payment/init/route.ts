import { NextResponse, NextRequest } from 'next/server';

const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  STARTER: 499,
  PRO: 999,
  BUSINESS: 2999,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const store_id = process.env.SSLCOMMERZ_STORE_ID || '<your_store_id>';
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || '<your_store_password>';
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    const body = await request.json();
    const { uid, plan } = body;

    const selectedPlan = String(plan).toUpperCase();

    if (!PLAN_PRICES[selectedPlan]) {
      return NextResponse.json(
        { success: false, message: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[selectedPlan];
    
    const data: Record<string, string> = {
      store_id: store_id,
      store_passwd: store_passwd,
      total_amount: String(amount),
      currency: 'BDT',
      tran_id: `REF${Date.now()}-${uid}`, // unique transaction id
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/ipn`,
      shipping_method: 'Courier',
      product_name: body.product_name || 'Computer',
      product_category: body.product_category || 'Electronic',
      product_profile: 'general',
      cus_name: body.cus_name || 'Customer Name',
      cus_email: body.cus_email || 'customer@example.com',
      cus_add1: body.cus_add1 || 'Dhaka',
      cus_add2: body.cus_add2 || 'Dhaka',
      cus_city: body.cus_city || 'Dhaka',
      cus_state: body.cus_state || 'Dhaka',
      cus_postcode: body.cus_postcode || '1000',
      cus_country: body.cus_country || 'Bangladesh',
      cus_phone: body.cus_phone || '01711111111',
      cus_fax: body.cus_fax || '01711111111',
      ship_name: body.ship_name || 'Customer Name',
      ship_add1: body.ship_add1 || 'Dhaka',
      ship_add2: body.ship_add2 || 'Dhaka',
      ship_city: body.ship_city || 'Dhaka',
      ship_state: body.ship_state || 'Dhaka',
      ship_postcode: String(body.ship_postcode || 1000),
      ship_country: body.ship_country || 'Bangladesh',
      value_a: body.uid,
      value_b: selectedPlan
    };

    // SSLCommerz API endpoint
    const sslcommerzUrl = is_live 
      ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    // Make direct API call to SSLCommerz
    const response = await fetch(sslcommerzUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    const apiResponse = await response.json();

    if (apiResponse.status === 'SUCCESS') {
      return NextResponse.json({
        success: true,
        url: apiResponse.GatewayPageURL,
        sessionkey: apiResponse.sessionkey,
        message: 'Payment gateway URL generated successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: apiResponse.failedreason || 'Payment initialization failed',
        },
        { status: 400 }
      );
    }
    
  } catch (error: unknown) {
    console.error('Payment initialization error:', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Payment initialization failed',
        error: errMsg
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';