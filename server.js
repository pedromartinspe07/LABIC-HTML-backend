const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Use a porta fornecida pelo Railway

// Middleware para habilitar o CORS (para que seu frontend possa se comunicar com este backend)
const cors = require('cors');
app.use(cors());

// A rota que registra o log de acesso
app.get('/api/log_acesso', (req, res) => {
  const logDir = path.join(__dirname, 'logs');
  const logFile = path.join(logDir, 'log_acessos.txt');

  // Garante que a pasta de logs existe
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  
  const logEntry = `Acesso em: ${new Date().toISOString()}, IP: ${req.ip}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Erro ao escrever no log:', err);
      return res.status(500).send('Erro no servidor.');
    }
    console.log('Acesso logado!');
    res.status(200).send('Log de acesso registrado.');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});