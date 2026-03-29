import {plans} from "@shared/lib/billingsdk-config";
import {PricingTableTwo} from "@shared/components/billingsdk/pricing-table-two.jsx";
import {PricingTableFive} from "@shared/components/billingsdk/pricing-table-five.jsx";

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