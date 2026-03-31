const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive'
const GOOGLE_DRIVE_PUBLIC_URL = 'https://drive.google.com/uc?export=view&id='

// Threshold above which we explicitly request a resumable upload (5 MB)
const RESUMABLE_THRESHOLD = 5 * 1024 * 1024

const getGoogleDriveConfig = () => {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL?.trim()
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim()
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim()

  if (!clientEmail || !privateKey || !folderId) {
    return null
  }

  return { clientEmail, privateKey, folderId }
}

const isGoogleDriveConfigured = () => Boolean(getGoogleDriveConfig())

const createDriveClient = () => {
  const config = getGoogleDriveConfig()
  if (!config) return null

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [GOOGLE_DRIVE_SCOPE],
  })

  return {
    drive: google.drive({ version: 'v3', auth }),
    folderId: config.folderId,
  }
}

const uploadFileToGoogleDrive = async (localFilePath, file) => {
  const client = createDriveClient()
  if (!client) {
    throw new Error('Google Drive upload is not configured')
  }

  const { drive, folderId } = client
  const fileName = file.originalname || file.filename

  // Determine file size so we can choose the right upload strategy
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
      supportsAllDrives: true,
    },
    {
      // Use resumable uploads for files >= 5 MB (handles up to 5 TB per Google's limits)
      // and multipart for small files (simpler, fewer round-trips)
      uploadType: useResumable ? 'resumable' : 'multipart',
      // Retry transient failures automatically (network blips, 5xx responses)
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
    supportsAllDrives: true,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
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

