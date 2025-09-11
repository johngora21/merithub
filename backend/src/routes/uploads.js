const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

// Ensure base upload directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = (req.query.category || 'images').toLowerCase()
    const allowed = ['images', 'videos', 'documents']
    const finalCategory = allowed.includes(category) ? category : 'images'
    const dest = path.join(__dirname, '../../uploads', finalCategory)
    ensureDir(dest)
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50)
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${base || 'file'}-${unique}${ext}`)
  }
})

const upload = multer({ storage })

// POST /api/uploads?category=images|videos|documents
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }
    const category = (req.query.category || 'images').toLowerCase()
    const relativePath = `/uploads/${['images','videos','documents'].includes(category) ? category : 'images'}/${req.file.filename}`
    res.json({ success: true, path: relativePath, filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size })
  } catch (e) {
    console.error('Upload error:', e)
    res.status(500).json({ success: false, message: 'Upload failed' })
  }
})

module.exports = router

