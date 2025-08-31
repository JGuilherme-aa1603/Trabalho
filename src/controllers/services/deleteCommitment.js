import prisma from "../../prismaClient.js";

const deleteCommitment = async (id) => {
    try {
        return await prisma.promessas.delete({
            where: { id }
        });
    } catch (error) {
        throw new Error("Erro ao deletar compromisso");
    }
};

export default deleteCommitment;
