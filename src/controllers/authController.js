import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../databaseConfig.js";

const jwtSecret = process.env.JWT_SECRET;

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
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login realizado com sucesso!", token });
  });
};

const authController = {
  register,
  login
};

export default authController;