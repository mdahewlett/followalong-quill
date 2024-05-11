import BillingForm from "@/components/BillingForm"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { useRouter } from "next/router";
import { useEffect } from "react";

const Page = async () => {
    const router = useRouter();

    useEffect(() => {
      // Check if the current URL contains the unwanted part
      if (router.asPath.includes('-jr3ifqlxh-mdahs-projects')) {
        // Redirect the user to the desired URL
        router.replace('/dashboard/billing');
      }
    }, [router]);

 const subscriptionPlan = await getUserSubscriptionPlan()

 return <BillingForm subscriptionPlan={subscriptionPlan}/>
}

export default Page