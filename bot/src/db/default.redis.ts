import { createClient, SchemaFieldTypes } from 'redis'

const client = await createClient({ url: process.env.REDIS_URL })
  .on('error', (err) => {
    console.error('Redis client error', err)
  })
  .connect()

let indexInfo: { numDocs: string } | undefined = undefined

try {
  indexInfo = await client.ft.info('idx:media')
} catch (err) {
  console.error(err)
}

if (indexInfo) {
  console.log(`Found index idx:media with ${indexInfo.numDocs} docs`)
} else {
  console.log('Creating index idx:media')
  await client.ft.create(
    'idx:media',
    {
      album: { type: SchemaFieldTypes.TEXT, WEIGHT: 3 },
      albumartist: { type: SchemaFieldTypes.TEXT, WEIGHT: 4 },
      artist: { type: SchemaFieldTypes.TEXT, WEIGHT: 4 },
      filename: { type: SchemaFieldTypes.TEXT, WEIGHT: 3 },
      genre: { type: SchemaFieldTypes.TEXT, WEIGHT: 3 },
      title: { type: SchemaFieldTypes.TEXT, WEIGHT: 6 },
      track: { type: SchemaFieldTypes.NUMERIC, WEIGHT: 4 },
      year: { type: SchemaFieldTypes.NUMERIC, WEIGHT: 2 },
    },
    {
      ON: 'HASH',
      PREFIX: 'media:',
    },
  )
}

export default client
