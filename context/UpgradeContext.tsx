"use client";

import { createContext, useContext, useState } from "react";

const UpgradePlanContext = createContext<{ isPricingModalOpen: boolean; onUpgrade: () => void; setIsPricingModalOpen: (value: boolean) => void }>({ isPricingModalOpen: false, onUpgrade: () => { }, setIsPricingModalOpen: () => { } });

export const UpgradePlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const onUpgrade = () => {
    setIsPricingModalOpen(true);
  };

  return (
    <UpgradePlanContext.Provider value={{ isPricingModalOpen, onUpgrade, setIsPricingModalOpen }}>
      {children}
    </UpgradePlanContext.Provider>
  );
};

export const useUpgradePlan = () => useContext(UpgradePlanContext);