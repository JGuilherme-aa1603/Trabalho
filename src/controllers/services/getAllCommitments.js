import prisma from "../../prismaClient.js";

const getAllCommitments = async () => {
    try {
        return await prisma.promessas.findMany();
    } catch (error) {
        throw new Error("Erro ao buscar compromissos");
    }
};

export default getAllCommitments;
