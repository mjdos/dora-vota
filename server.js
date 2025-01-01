const express = require("express");
const { exec, spawn } = require("child_process");

const app = express();
app.use(express.json());

app.post("/execute-command", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Senha não fornecida." });
  }

  // Monta o comando com WSL
  const command = `echo ${password} | wsl dorad keys list`;

  // Executa o comando no terminal
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro: ${error.message}`);
      return res.status(500).json({ error: stderr || error.message });
    }

    res.json({ output: stdout });
  });
});

app.post("/execute-delete", (req, res) => {
  const { password, name } = req.body;

  if (!password || !name) {
    return res.status(400).json({ error: "Nome ou senha não fornecidos." });
  }

  // Cria o comando para adicionar a chave com o nome fornecido
  const command = `wsl dorad keys delete ${name}`;

  // Executa o comando em um processo filho
  const process = spawn("powershell", ["-Command", command]);

  // Envia as entradas interativas (senha e repetição de senha) para o processo
  process.stdin.write(`${password}\n`);  // Envia a senha
  process.stdin.write(`y\n`);  // Envia a senha

  // Captura a saída do comando
  let output = '';
  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error("Erro: ", data.toString());
  });

  // Quando o comando terminar, retornamos a saída do terminal
  process.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Erro ao criar o usuário." });
    }

    // Retorna a saída completa do terminal sem processamento
    res.json({ output });
  });
});

app.post("/create-user", (req, res) => {
  const { password, name } = req.body;

  if (!password || !name) {
    return res.status(400).json({ error: "Nome ou senha não fornecidos." });
  }

  // Cria o comando para adicionar a chave com o nome fornecido
  const command = `wsl dorad keys add ${name}`;

  // Executa o comando em um processo filho
  const process = spawn("powershell", ["-Command", command]);

  // Envia as entradas interativas (senha e repetição de senha) para o processo
  process.stdin.write(`${password}\n`);  // Envia a senha

  // Captura a saída do comando
  let output = '';
  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error("Erro: ", data.toString());
  });

  // Quando o comando terminar, retornamos a saída do terminal
  process.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Erro ao criar o usuário." });
    }

    // Retorna a saída completa do terminal sem processamento
    res.json({ output });
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
