const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive'
const GOOGLE_DRIVE_PUBLIC_URL = 'https://drive.google.com/uc?export=view&id='

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

  const createdFile = await drive.files.create({
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
    uploadType: 'resumable',
  })

  const fileId = createdFile.data.id
  if (!fileId) {
    throw new Error('Google Drive upload failed to return a file id')
  }

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
