import prisma from "../prismaClient.js";
import { z } from "zod";
import getCommitmentById from "./services/getCommitmentById.js";
import updateCommitment from "./services/updateCommitment.js";
import deleteCommitment from "./services/deleteCommitment.js";

const createCommitmentSchema = z.object({
  titulo: z.string().min(2, "O título é muito curto").max(100),
  descricao: z.string().min(2, "A descrição é muito curta").max(500),
  categoria_id: z.number().int().positive("A categoria é obrigatória"),
});

const create = async (req, res) => {
  const validation = createCommitmentSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }
  try {
    const { titulo, descricao, categoria_id } = validation.data;
    const usuario_id = req.user.id;

    const commitment = await prisma.promessas.create({
      data: {
        titulo,
        promessa: descricao,
        categoria_id,
        usuario_id,
      },
      include: {
        usuarios: {
          select: { nome: true },
        },
        categorias: {
          select: { nome: true },
        },
      },
    });
    return res.status(201).json(commitment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar compromisso" });
  }
};

const getAll = async (req, res) => {
  try {
    const commitments = await prisma.promessas.findMany({
      where: {
        ativo: true, // Apenas compromissos ativos
      },
      orderBy: {
        data_criacao: "desc",
      },
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
            nome: true
          },
        },
      },
    });
    return res.status(200).json(commitments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar compromissos" });
  }
};

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const commitment = await getCommitmentById(id);
    if (!commitment) {
      return res.status(404).json({ error: "Compromisso não encontrado" });
    }

    return res.status(200).json(commitment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar compromisso" });
  }
};

const updateCommitmentSchema = z.object({
  titulo: z.string().min(2, "O título é muito curto").max(100).optional(),
  promessa: z.string().min(2, "A descrição é muito curta").max(500).optional(),
  categoria_id: z
    .number()
    .int()
    .positive("A categoria é obrigatória")
    .optional(),
});

const update = async (req, res) => {
  const validation = updateCommitmentSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const updatedCommitment = await updateCommitment(id, validation.data);
    return res.status(200).json(updatedCommitment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar compromisso" });
  }
};

const deleteC = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await deleteCommitment(id);
    return res
      .status(200)
      .json({ message: "Compromisso deletado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao deletar compromisso" });
  }
};

const commitmentController = {
  create,
  getAll,
  getById,
  update,
  deleteC,
};

export default commitmentController;
