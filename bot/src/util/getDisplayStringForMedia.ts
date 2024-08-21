import type { MediaInfoStored } from '~/bot/types/types.js'
import formatDuration from 'format-duration'

export const getDisplayStringForMedia = ({
  album: _album,
  albumArtist: _albumArtist,
  artist: _artist,
  duration: _duration,
  title: _title,
}: MediaInfoStored) => {
  const artist = _artist ?? _albumArtist ?? 'Unknown artist'
  const album = _album ?? 'Unknown album'
  const duration = formatDuration(Number(_duration * 1000))
  const title = _title ?? 'Unknown'

  return `${artist} - ${title} (${album}) [${duration}]`
}
