import prisma from "../../prismaClient.js";

const getCommitmentById = async (id) => {
  try {
    return await prisma.promessas.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nome: true,
          },
        },
        categorias: {
          select: {
            id: true,
            nome: true,
            icone_nome: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar compromisso:", error);
    throw new Error("Erro ao buscar compromisso");
  }
};

export default getCommitmentById;
