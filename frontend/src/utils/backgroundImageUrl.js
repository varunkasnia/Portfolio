const GOOGLE_DRIVE_HOSTS = new Set([
  'drive.google.com',
  'docs.google.com',
])

const extractGoogleDriveFileId = (url) => {
  if (!GOOGLE_DRIVE_HOSTS.has(url.hostname)) return ''

  const queryId = url.searchParams.get('id')?.trim()
  if (queryId) return queryId

  const pathMatch = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (pathMatch?.[1]) return pathMatch[1]

  const fileMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch?.[1]) return fileMatch[1]

  return ''
}

export const normalizeBackgroundImageUrl = (rawUrl) => {
  const trimmedUrl = rawUrl?.trim()
  if (!trimmedUrl) return ''

  try {
    const url = new URL(trimmedUrl)
    const googleDriveFileId = extractGoogleDriveFileId(url)

    if (googleDriveFileId) {
      return `https://drive.google.com/uc?export=view&id=${googleDriveFileId}`
    }

    return trimmedUrl
  } catch {
    return trimmedUrl
  }
}
