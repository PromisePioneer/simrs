"use client"

import { PricingTableFive } from "@shared/components/billingsdk/pricing-table-five"
import { plans } from "@shared/lib/billingsdk-config"

export function PricingTableFiveDemo() {
  return (
    <PricingTableFive
      plans={plans}
      theme="classic"
      onPlanSelect={(planId) => console.log("Selected plan:", planId)}
      title="Budget-friendly pricing alternatives"
      description="Get started free or upgrade to share your impact for all completed tasks with multiple people" />
  );
}
