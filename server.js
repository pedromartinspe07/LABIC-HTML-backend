// server.js

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors'); // Importa o pacote CORS
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
// Permite requisições do seu frontend. Substitua pelo seu domínio de produção.
const corsOptions = {
  origin: 'https://labic-html.firebaseapp.com',
  optionsSuccessStatus: 200 // Algumas versões de navegadores mais antigos precisam disso
};
app.use(cors(corsOptions));

// Define a pasta 'frontend' como o diretório de arquivos estáticos.
// O __dirname é o diretório onde o server.js está. '..' sobe um nível.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rota para a API de log. Usamos POST para registrar dados.
app.post('/api/log_acesso', async (req, res) => {
  const logDir = path.join(__dirname, 'logs');
  const logFile = path.join(logDir, 'acessos.log');

  try {
    // Garante que o diretório de logs existe de forma assíncrona.
    await fs.mkdir(logDir, { recursive: true });

    // Obtenção do IP do cliente de forma mais robusta e segura
    const clientIP = req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;
    const logEntry = `Acesso em: ${new Date().toISOString()}, IP: ${clientIP}\n`;

    // Grava a entrada de log de forma assíncrona.
    await fs.appendFile(logFile, logEntry);
    console.log(`Log de acesso registrado: ${logEntry.trim()}`);
    
    // Responde com sucesso.
    res.status(200).send('Log de acesso registrado com sucesso.');
  } catch (error) {
    console.error('Falha ao registrar log de acesso:', error);
    // Envia uma resposta de erro mais clara para o cliente.
    res.status(500).send('Erro interno do servidor ao registrar log.');
  }
});

// Inicia o servidor e exibe a porta em que está rodando.
app.listen(PORT, () => {
  console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});