import createCommitment from "./services/createCommitment.js";
import getCommitmentById from "./services/getCommitmentById.js";
import getAllCommitments from "./services/getAllCommitments.js";
import updateCommitment from "./services/updateCommitment.js";
import deleteCommitment from "./services/deleteCommitment.js";
import { z } from "zod";

const commitmentSchema = z.object({
  nome: z.string().min(2).max(100),
  promessa: z.string().min(5).max(500)
});

const updateSchema = z.object({
    id: z.string(),
    data: commitmentSchema
});

const idSchema = z.string();

const create = async (req, res) => {
    const validation = commitmentSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }
    try {
        const { nome, promessa } = validation.data;
        const usuario_id = req.user.id;

        const commitment = await createCommitment(usuario_id, nome, promessa);
        return res.status(201).json(commitment);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};

const getById = async (req, res) => {
    const validation = idSchema.safeParse(req.params.id);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }

    const id = Number(validation.data);

    try {
        const commitment = await getCommitmentById(id);
        if (!commitment) {
            return res.status(404).json({ error: "Compromisso não encontrado" });
        }
        return res.status(200).json(commitment);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getAll = async (req, res) => {
    try {
        const commitments = await getAllCommitments();
        return res.status(200).json(commitments);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    const validation = updateSchema.safeParse({
        id: req.params.id,
        data: req.body
    });

    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }

    const { id, data } = validation.data;

    try {
        const commitment = await updateCommitment(Number(id), data);
        if (!commitment) {
            return res.status(404).json({ error: "Compromisso não encontrado" });
        }
        return res.status(200).json(commitment);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteC = async (req, res) => {
    const validation = idSchema.safeParse(req.params.id);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }

    const id = Number(validation.data);

    try {
        const commitment = await deleteCommitment(id);
        if (!commitment) {
            return res.status(404).json({ error: "Compromisso não encontrado" });
        }
        return res.status(200).json(commitment);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const commitmentController = {
  create,
  getById,
  getAll,
  update,
  deleteC

};

export default commitmentController;
