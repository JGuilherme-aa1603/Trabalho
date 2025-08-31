import prisma from "../../prismaClient.js";

const createCommitment = async (usuario_id, nome, promessa) => {
  try {
    const commitment = await prisma.promessas.create({
      data: {
        usuario_id,
        nome,
        promessa
      }
    });

    return commitment;
  } catch (error) {
    console.error("Erro ao criar compromisso:", error);
    throw new Error("Erro ao criar compromisso");
  }
};

export default createCommitment;
