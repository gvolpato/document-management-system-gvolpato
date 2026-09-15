const documentService = require('../services/documentService');

function uploadDocument(req, res) {
  try {
    const document = documentService.createDocument({
      file: req.file,
      owner: req.body.owner,
    });

    return res.status(201).json(document);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

function listDocuments(req, res) {
  try {
    const documents = documentService.listDocuments();
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ error: 'Não foi possível listar os documentos.' });
  }
}

function downloadDocument(req, res) {
  try {
    const document = documentService.getDocumentForDownload(req.params.id);

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }

    return res.download(document.storagePath, document.originalName);
  } catch (error) {
    return res.status(500).json({ error: 'Não foi possível baixar o documento.' });
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
