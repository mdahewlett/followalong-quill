import ChatWrapper from '@/components/chat/ChatWrapper';
import PdfRenderer from '@/components/PdfRenderer';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { getUserSubscriptionPlan } from '@/lib/stripe';

interface PageProps {
  params: {
    fileid: string /* has to match [fileid]*/;
  };
}
const Page = async ({ params }: PageProps) => {
  // retrive file id
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const subscriptionPlan = await getUserSubscriptionPlan(); // added 

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`);

  // make database call
  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* left side */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            <PdfRenderer url={file.url} />
          </div>
        </div>

        {/* right side */}
        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id} subscriptionPlan={subscriptionPlan}/> {/* passed subscription info */}
        </div>
      </div>
    </div>
  );
};

export default Page;

