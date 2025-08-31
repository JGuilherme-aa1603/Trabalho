import prisma from "../../prismaClient.js";

const updateCommitment = async (id, data) => {
    try {
        return await prisma.promessas.update({
            where: { id },
            data
        });
    } catch (error) {
        throw new Error("Erro ao atualizar compromisso");
    }
};

export default updateCommitment;
