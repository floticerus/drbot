import events from './events.js'
import { pluralize } from '~/bot/util/index.js'

events.on('index:start', () => {
  console.log('Building index... this could take a little bit')
})

events.on('index:found', (/* _numResults: number */) => {
  // console.log(`Indexing ${numResults} media ${pluralize(numResults, 'file', 'files')}}`)
})

events.on(
  'index:complete',
  ({ duration, numResults }: { duration: number; numResults: number }) => {
    const seconds = duration / 1000
    console.log(
      `Finished indexing ${numResults} ${pluralize(numResults, 'file', 'files')}} in ${seconds} ${pluralize(seconds, 'second', 'seconds')}`,
    )
  },
)

events.on(
  'index:prune:complete',
  ({ duration, numDeleted }: { duration: number; numDeleted: number }) => {
    const seconds = duration / 1000
    console.log(
      `Pruning removed ${numDeleted ? '~' : ''}${numDeleted} media ${pluralize(numDeleted, 'entry', 'entries')} in ${seconds} ${pluralize(seconds, 'second', 'seconds')}}`,
    )
  },
)
