import prisma from "../prismaClient.js";

const checkCommitmentOwnership = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const commitment = await prisma.promessas.findUnique({ where: { id: Number(id) } });

  if (!commitment) {
    return res.status(404).json({ error: "Compromisso não encontrado" });
  }

  if (commitment.usuario_id !== userId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  // Se passou, pode continuar para o controller
  next();
};

export default checkCommitmentOwnership;