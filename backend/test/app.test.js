const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

async function startTestServer() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
  };
}

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('faz upload, lista e baixa documentos', async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['hello world'], { type: 'text/plain' }), 'sample.txt');
    formData.append('owner', 'user_001');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(uploadResponse.status, 201, 'o upload deve criar o documento');
    const uploadBody = await uploadResponse.json();
    assert.ok(uploadBody.id, 'o documento deve ter um id');
    assert.strictEqual(uploadBody.originalName, 'sample.txt');
    assert.strictEqual(uploadBody.owner, 'user_001');

    const listResponse = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(listResponse.status, 200, 'a listagem deve retornar sucesso');
    const documents = await listResponse.json();
    assert.ok(Array.isArray(documents), 'a listagem deve retornar array');
    assert.ok(documents.length > 0, 'deve existir ao menos um documento');

    const downloadedResponse = await fetch(`${baseUrl}/documents/${uploadBody.id}/download`);
    assert.strictEqual(downloadedResponse.status, 200, 'o download deve funcionar');
    const fileContent = await downloadedResponse.text();
    assert.strictEqual(fileContent, 'hello world', 'o conteúdo baixado deve ser o mesmo do upload');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
});
