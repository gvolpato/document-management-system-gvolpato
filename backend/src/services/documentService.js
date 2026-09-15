const documentRepository = require('../repositories/documentRepository');

function createDocument({ file, owner }) {
  if (!file) {
    throw new Error('Arquivo obrigatório não informado.');
  }

  if (!owner) {
    throw new Error('Identificação do proprietário é obrigatória.');
  }

  return documentRepository.saveDocument(file, owner);
}

function listDocuments() {
  return documentRepository.listDocuments();
}

function getDocumentForDownload(id) {
  return documentRepository.findById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentForDownload,
};
