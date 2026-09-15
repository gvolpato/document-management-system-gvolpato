const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const STORAGE_DIR = path.resolve(__dirname, '../../storage');
const documents = new Map();

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function saveDocument(file, owner) {
  ensureStorageDir();

  const id = randomUUID();
  const storedName = `${Date.now()}-${randomUUID()}-${path.basename(file.originalname || 'document')}`;
  const storagePath = path.join(STORAGE_DIR, storedName);

  fs.renameSync(file.path, storagePath);

  const document = {
    id,
    originalName: file.originalname,
    storedName,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
    owner,
    storagePath,
  };

  documents.set(id, document);

  return {
    id: document.id,
    originalName: document.originalName,
    storedName: document.storedName,
    size: document.size,
    mimeType: document.mimeType,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
    storagePath: document.storagePath,
  };
}

function listDocuments() {
  return [...documents.values()].map((document) => ({
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  }));
}

function findById(id) {
  return documents.get(id) || null;
}

module.exports = {
  STORAGE_DIR,
  saveDocument,
  listDocuments,
  findById,
};
