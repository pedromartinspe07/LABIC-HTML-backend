const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// O Express agora vai servir todos os arquivos estáticos da pasta 'frontend'.
// O __dirname é o diretório onde o server.js está. '..' sobe um nível.
// O resultado será o caminho para a pasta 'frontend'.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Define a rota para a API de log. Usamos POST para ser mais semântico
// e seguro, já que estamos "escrevendo" dados (o log).
app.post('/api/log_acesso', async (req, res) => {
  const logDir = path.join(__dirname, 'logs');
  const logFile = path.join(logDir, 'acessos.log');

  try {
    // Tenta garantir que o diretório de logs existe.
    // O 'recursive: true' evita um erro se o diretório já existir.
    await fs.mkdir(logDir, { recursive: true });

    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const logEntry = `Acesso em: ${new Date().toISOString()}, IP: ${clientIP}\n`;

    // Grava a entrada de log de forma assíncrona.
    await fs.appendFile(logFile, logEntry);
    console.log('Log de acesso registrado com sucesso.');
    res.status(200).send('Log de acesso registrado.');
  } catch (error) {
    console.error('Falha ao registrar log de acesso:', error);
    res.status(500).send('Erro interno do servidor.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});