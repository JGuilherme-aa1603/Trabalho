import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Timaeus1!",
  database: "arvore",
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

const register = async (req, res) => {
  const { email, nome, senha } = req.body;

  if (!email || !nome || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  // Criptografar senha
  const hashedsenha = await bcrypt.hash(senha, 10);

  const sql = "INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)";
  db.query(sql, [email, nome, hashedsenha], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao cadastrar" });
    }
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  });
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha email e senha" });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = results[0];

    // Comparar senha digitada com a hash salva
    const validsenha = await bcrypt.compare(senha, user.senha);
    if (!validsenha) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Criar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "segredo_super_forte", // depois coloca em variáveis de ambiente (.env)
      { expiresIn: "1h" }
    );

    res.json({ message: "Login realizado com sucesso!", token });
  });
};

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

module.exports = { register, login };
