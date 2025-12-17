import { createClient, SCHEMA_FIELD_TYPE } from 'redis'

const client = await createClient({ url: process.env.REDIS_URL })
  .on('error', (err) => {
    console.error('Redis client error', err)
  })
  .connect()

let indexInfo: { num_docs: string } | undefined = undefined

try {
  indexInfo = await client.ft.info('idx:media')
} catch (err) {
  console.error(err)
}

if (indexInfo) {
  console.log(`Found index idx:media with ${indexInfo.num_docs} docs`)
} else {
  console.log('Creating index idx:media')
  await client.ft.create(
    'idx:media',
    {
      album: { type: SCHEMA_FIELD_TYPE.TEXT, WEIGHT: 3 },
      albumartist: { type: SCHEMA_FIELD_TYPE.TEXT, WEIGHT: 4 },
      artist: { type: SCHEMA_FIELD_TYPE.TEXT, WEIGHT: 4 },
      filename: { type: SCHEMA_FIELD_TYPE.TEXT, WEIGHT: 3 },
      genre: { type: SCHEMA_FIELD_TYPE.TEXT, WEIGHT: 3 },
      title: { type: SCHEMA_FIELD_TYPE.TEXT, WEIGHT: 6 },
      track: { type: SCHEMA_FIELD_TYPE.NUMERIC, WEIGHT: 4 },
      year: { type: SCHEMA_FIELD_TYPE.NUMERIC, WEIGHT: 2 },
    },
    {
      ON: 'HASH',
      PREFIX: 'media:',
    },
  )
}

export default client
