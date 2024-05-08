// vercel compile error, adjusted lines below

import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server'; //add NextResponse

export default async function handler( //add default, swap GET with handler
    request: NextRequest, 
    { params }: any
): Promise<Response> { //add proimse<repsonse>
  const endpoint = params.kindeAuth;
  const authHandler = handleAuth(request, endpoint); //all new
  return await authHandler(request, NextResponse);
}
