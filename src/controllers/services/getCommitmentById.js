import prisma from "../../prismaClient.js";

const getCommitmentById = async (id) => {
    try {
        return await prisma.promessas.findUnique({
            where: { id }
        });
    } catch (error) {
        console.error("Erro ao buscar compromisso:", error);
        throw new Error("Erro ao buscar compromisso");
    }
};

export default getCommitmentById;
