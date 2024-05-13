/* import { PineconeClient } from '@pinecone-database/pinecone'

export const getPineconeClient = async () => {
  const client = new PineconeClient()

  await client.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: 'us-east1-gcp',
  })

  return client
}
*/

import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY!

const pinecone = new Pinecone({
  // unclear if I need to specify environment
  //environment: 'us-east1',
  apiKey
})

export const getPinecone = () => pinecone.Index("speedyreader");