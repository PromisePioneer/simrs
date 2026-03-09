import {plans} from "@/lib/billingsdk-config.js";
import {PricingTableTwo} from "@/components/billingsdk/pricing-table-two.jsx";
import {PricingTableFive} from "@/components/billingsdk/pricing-table-five.jsx";

function Pricing() {
    return (
        <>
            <PricingTableFive
                plans={plans}
                theme="minimal"
                onPlanSelect={(planId) => console.log("Selected plan:", planId)}
                title="Budget-friendly pricing alternatives"
                description="Get started free or upgrade to share your impact for all completed tasks with multiple people"
            />
        </>
    )
}

export default Pricing;