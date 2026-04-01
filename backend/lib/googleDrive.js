const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_DRIVE_PUBLIC_URL = 'https://drive.google.com/uc?export=view&id='

// Threshold above which we use resumable upload (5 MB)
const RESUMABLE_THRESHOLD = 5 * 1024 * 1024

const getGoogleDriveConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim()
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim()

  if (!clientId || !clientSecret || !refreshToken || !folderId) {
    return null
  }

  return { clientId, clientSecret, refreshToken, folderId }
}

const isGoogleDriveConfigured = () => Boolean(getGoogleDriveConfig())

const createDriveClient = () => {
  const config = getGoogleDriveConfig()
  if (!config) return null

  // OAuth2 — files are owned by YOUR Google account, not the service account,
  // so they count against your storage quota (no quota error).
  const auth = new google.auth.OAuth2(config.clientId, config.clientSecret)
  auth.setCredentials({ refresh_token: config.refreshToken })

  return {
    drive: google.drive({ version: 'v3', auth }),
    folderId: config.folderId,
  }
}

const uploadFileToGoogleDrive = async (localFilePath, file) => {
  const client = createDriveClient()
  if (!client) {
    throw new Error(
      'Google Drive is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ' +
      'GOOGLE_REFRESH_TOKEN and GOOGLE_DRIVE_FOLDER_ID in your environment.'
    )
  }

  const { drive, folderId } = client
  const fileName = file.originalname || file.filename

  const fileSizeBytes = fs.statSync(localFilePath).size
  const useResumable = fileSizeBytes >= RESUMABLE_THRESHOLD

  const createdFile = await drive.files.create(
    {
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(localFilePath),
      },
      fields: 'id,name',
    },
    {
      uploadType: useResumable ? 'resumable' : 'multipart',
      retry: true,
      retryConfig: {
        retry: 3,
        retryDelay: 1000,
        statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
      },
    }
  )

  const fileId = createdFile.data.id
  if (!fileId) {
    throw new Error('Google Drive upload failed to return a file id')
  }

  // Make the uploaded file publicly readable
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
    fields: 'id',
  })

  return {
    fileId,
    url: `${GOOGLE_DRIVE_PUBLIC_URL}${fileId}`,
  }
}

module.exports = {
  isGoogleDriveConfigured,
  uploadFileToGoogleDrive,
}
