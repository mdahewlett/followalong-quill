import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { getPinecone } from '@/app/lib/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new Error('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url, // changed from 4:39:05, suggested was below
          /* url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`, */
          uploadStatus: 'PROCESSING',
        },
      });

      try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load()
        // added metadata filtering
        pageLevelDocs.forEach((doc, i) => {
          doc.metadata = {
            ...doc.metadata,
            fileId:createdFile.id
          }
        })
        // end add

        const pagesAmt = pageLevelDocs.length;

        // vectorize and index entire document
        const pineconeIndex = getPinecone();

        //add metadata filtering
        for (const doc of pageLevelDocs) {
          doc.metadata = { ...doc.metadata, fileId: createdFile.id };
        }
        // end add

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(
          pageLevelDocs, 
          embeddings, 
          {
          pineconeIndex,
          // removed namespace
          // namespace: createdFile.id,
        }
      )

      await db.file.update({
        data: {
          uploadStatus: "SUCCESS"
        },
        where: {
          id: createdFile.id
        }
      })
    } catch (err) {
        await db.file.update({
          data: {
            uploadStatus: "FAILED"
          },
          where: {
            id: createdFile.id
          }
        })
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
