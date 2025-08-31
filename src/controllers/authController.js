import registerService from "./services/registerService.js";
import loginService from "./services/loginService.js";
import { z } from "zod";

const registerSchema = z.object({
  email: z.email(),
  nome: z.string().min(2).max(100),
  senha: z.string().min(5).max(100)
});

const register = async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: validation.error.issues.map(issue => ({
        message: issue.message,
        path: issue.path
      }))
    });
  }

  const { email, nome, senha } = validation.data;

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

const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(5).max(100)
});

const login = async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: validation.error.issues.map(issue => ({
        message: issue.message,
        path: issue.path
      }))
    });
  }

  const { email, senha } = validation.data;
  
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