import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: any
): Promise<any> { //add Promise<any> to resolve deployment compile error
        const endpoint = params.kindeAuth
        return await handleAuth(request, endpoint)
}
