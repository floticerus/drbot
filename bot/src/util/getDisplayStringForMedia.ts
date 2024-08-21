import type { MediaInfoStored } from '~/bot/types/types.js'

export const getDisplayStringForMedia = ({
  album: _album,
  albumArtist: _albumArtist,
  artist: _artist,
  title: _title,
}: MediaInfoStored) => {
  const artist = _artist ?? _albumArtist ?? 'Unknown artist'
  const album = _album ?? 'Unknown album'
  const title = _title ?? 'Unknown'

  return `${artist} - ${title} (${album})`
}
