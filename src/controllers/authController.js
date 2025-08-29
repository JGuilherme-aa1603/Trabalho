import registerService from "./services/registerService.js";
import loginService from "./services/loginService.js";

const register = async (req, res) => {
  const { email, nome, senha } = req.body;

  if (!email || !nome || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  try {
    await registerService(email, nome, senha);

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);

    if (err.message === "Email já cadastrado") {
      return res.status(409).json({ error: err.message });
    }

    res.status(500).json({ error: "Erro ao cadastrar" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha email e senha" });
  }

  try {
    const token = await loginService(email, senha);

    res.status(200).json({ message: "Login realizado com sucesso!", token });

  } catch (err) {
    console.error(err);

    if (err.message === "Usuário não encontrado") {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === "Senha incorreta") {
      return res.status(401).json({ error: err.message });
    }

    res.status(500).json({ error: "Erro no servidor" });
  }
};

const authController = {
  register,
  login
};

export default authController;