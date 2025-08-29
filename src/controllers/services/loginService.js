import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../../prismaClient.js";

const loginService = async (email, senha) => {
    
    const jwtSecret = process.env.JWT_SECRET;

    const user = await prisma.usuarios.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    // Comparar senha digitada com a hash salva
    const validsenha = await bcrypt.compare(senha, user.senha_hash);
    if (!validsenha) {
      throw new Error("Senha incorreta");
    }

    // Criar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return token;
}

export default loginService;