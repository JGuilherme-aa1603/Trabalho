import bcrypt from "bcryptjs";
import prisma from "../../prismaClient.js";

const registerService = async (email, nome, senha) => {
    const hashedsenha = await bcrypt.hash(senha, 10);

    try {
        await prisma.usuarios.create({
            data: {
            email,
            nome,
            senha_hash: hashedsenha,
            },
        });
    } catch (error) {
        if (error.code === "P2002") {
            throw new Error("Email já cadastrado");
        }
        throw new Error("Erro ao cadastrar usuário");
    }
    };

export default registerService;