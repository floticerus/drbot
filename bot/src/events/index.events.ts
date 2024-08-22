import events from './events.js'

events.on('index:start', () => {
  console.log('Building index... this could take a little bit')
})

events.on('index:found', (/* _numResults: number */) => {
  // console.log(`Indexing ${numResults} media file${numResults === 1 ? '' : 's'}`)
})

events.on(
  'index:complete',
  ({ duration, numResults }: { duration: number; numResults: number }) => {
    console.log(
      `Finished indexing ${numResults} file${numResults === 1 ? '' : 's'} in ${duration / 1000} seconds`,
    )
  },
)

events.on(
  'index:prune:complete',
  ({ duration, numDeleted }: { duration: number; numDeleted: number }) => {
    const seconds = duration / 1000
    console.log(
      `Pruning removed ${numDeleted ? '~' : ''}${numDeleted} media entries in ${seconds} second${seconds === 1 ? '' : 's'}`,
    )
  },
)
