"use client"

import { trpc } from "@/app/_trpc/client"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    // mod since onSuccess not in useQuery,@brokenquotes_en and @amanxsharma20 comments in video
    const {data, error} = trpc.authCallback.useQuery(undefined);
    
    useEffect(() => {
        if (data?.success) {
            // user is synced to db
            router.push(origin ? `/${origin}` : `/dashboard`);
        } else if (error?.data?.code==="UNAUTHORIZED") {console.log('error: ', error);
    router.push("/sign-in");
}
    }, [data, error, router, origin]);

    // how to handle error if it is thrown, is this missing?
    /*
        retry: true,
        retryDelay: 500,
    */

        return (
            <div className='w-full mt-24 flex justify-center'>
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                    <h3 className="font-semibold text-xl">Setting up your account...</h3>
                    <p>You will be redirected automatically.</p>
                </div>
            </div>
        )



    }

export default Page