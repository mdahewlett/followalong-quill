'use client';

import { trpc } from '@/app/_trpc/client';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ChatContextProvider } from './ChatContext';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { useEffect, useState } from 'react';

interface ChatWrapperProps {
  fileId: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>; // added for dynamic user limits
}

const ChatWrapper = ({ fileId, subscriptionPlan }: ChatWrapperProps) => { // added for dynamic user limits

  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
    fileId,
  });

  const refetchInterval = () =>
    // moved refetch out, works but why
    data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500;

  trpc.getFileUploadStatus.useQuery({ fileId }, { refetchInterval });

  // add to update file status after subscription
  const [uploadStatusUpdated, setUploadStatusUpdated] = useState(false);

  const { mutate: updateFileStatus } = trpc.updateFileUploadStatus.useMutation({
    onSuccess: () => {
      setUploadStatusUpdated(true);
    },
    onError: (error) => {
      console.error('An error occurred while updating the file status', error);
    },
  });
  
  const planName = subscriptionPlan?.name ?? 'Free';
  const planPages = subscriptionPlan?.pagesPerPdf ?? 5;

  useEffect(() => {
    // enabling docs after upgrade
    if (
      data?.status === 'FAILED' &&
      data.pages <= planPages &&
      !uploadStatusUpdated
    ) {
      updateFileStatus({ fileId, status: 'SUCCESS' });
    }

    // disabling docs after downgrade
    if (
      data?.status === 'SUCCESS' &&
      data.pages >= planPages &&
      !uploadStatusUpdated
    ) {
      updateFileStatus({ fileId, status: 'FAILED' });
    }    
  }, [data, planPages, fileId, uploadStatusUpdated, updateFileStatus]);
  // end add

  if (isLoading)
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>Loading...</h3>
            <p className='tex-zinc-500 text-sm'>
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === 'PROCESSING')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>Processing PDF...</h3>
            <p className='tex-zinc-500 text-sm'>This won&apos;t take long.</p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === 'FAILED')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <XCircle className='h-8 w-8 text-red-500' />
            <h3 className='font-semibold text-xl'>Too many pages in PDF</h3>
            <p className='tex-zinc-500 text-sm'>
              Your <span className='font-medium'>{planName}</span> plan supports
              up to {planPages} pages per PDF.
              {/* updated for pro user limits */}
            </p>
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4',
              })}
            >
              <ChevronLeft className='h-3 w-3 mr-1.5' />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 justify-between flex flex-col mb-28'>
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;