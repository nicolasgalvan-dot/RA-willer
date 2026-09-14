import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

const app = express();

app.use(express.json());

// Rota inicial de verificação
app.get("/", (req, res) => {
  res.json({ mensagem: "API StreamFit rodando com sucesso!" });
});

// ==================== TREINOS ====================

// Criar treino
app.post("/treinos", async (req, res) => {
  const { nome, objetivo } = req.body;

  if (!nome || !objetivo) {
    return res.status(400).json({ erro: "Nome e objetivo são obrigatórios" });
  }

  try {
    const treino = await prisma.treino.create({
      data: { nome, objetivo }
    });

    res.status(201).json(treino);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar treino" });
  }
});

// Listar todos os treinos
app.get("/treinos", async (req, res) => {
  try {
    const treinos = await prisma.treino.findMany({
      include: {
        exercicios: {
          include: { exercicio: true }
        }
      }
    });

    res.json(treinos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar treinos" });
  }
});

// Buscar treino específico por ID
app.get("/treinos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID do treino inválido" });
  }

  try {
    const treino = await prisma.treino.findUnique({
      where: { id },
      include: {
        exercicios: {
          include: { exercicio: true }
        }
      }
    });

    if (!treino) {
      return res.status(404).json({ erro: "Treino não encontrado" });
    }

    res.json(treino);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar treino" });
  }
});

// Atualizar treino (suporta PUT /treinos com id no body E PUT /treinos/:id)
const atualizarTreino = async (req, res) => {
  const id = parseInt(req.params.id || req.body.id);
  const { nome, objetivo } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID do treino é obrigatório e deve ser numérico" });
  }

  try {
    const treino = await prisma.treino.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(objetivo !== undefined && { objetivo })
      }
    });

    res.json(treino);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Treino não encontrado" });
    }
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar treino" });
  }
};

app.put("/treinos/:id", atualizarTreino);
app.put("/treinos", atualizarTreino);

// Excluir treino
app.delete("/treinos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID do treino inválido" });
  }

  try {
    await prisma.treino.delete({
      where: { id }
    });

    res.json({ mensagem: "Treino excluído" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Treino não encontrado" });
    }
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir treino" });
  }
});

// ==================== EXERCÍCIOS ====================

// Criar exercício
app.post("/exercicios", async (req, res) => {
  const { nome, grupoMuscular } = req.body;

  if (!nome || !grupoMuscular) {
    return res.status(400).json({ erro: "Nome e grupoMuscular são obrigatórios" });
  }

  try {
    const exercicio = await prisma.exercicios.create({
      data: { nome, grupoMuscular }
    });

    res.status(201).json(exercicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar exercício" });
  }
});

// Listar exercícios
app.get("/exercicios", async (req, res) => {
  try {
    const exercicios = await prisma.exercicios.findMany();

    res.json(exercicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar exercícios" });
  }
});

// Buscar exercício por ID
app.get("/exercicios/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID do exercício inválido" });
  }

  try {
    const exercicio = await prisma.exercicios.findUnique({
      where: { id }
    });

    if (!exercicio) {
      return res.status(404).json({ erro: "Exercício não encontrado" });
    }

    res.json(exercicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar exercício" });
  }
});

// Excluir exercício por ID
app.delete("/exercicios/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID do exercício inválido" });
  }

  try {
    await prisma.exercicios.delete({
      where: { id }
    });

    res.json({ mensagem: "Exercício excluído" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Exercício não encontrado" });
    }
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir exercício" });
  }
});

// ==================== VÍNCULO TREINO - EXERCÍCIO ====================

// Vincular exercício a treino
app.post("/treinos/vincular", async (req, res) => {
  const treinoId = parseInt(req.body.treinoId);
  const exercicioId = parseInt(req.body.exercicioId);

  if (isNaN(treinoId) || isNaN(exercicioId)) {
    return res.status(400).json({ erro: "treinoId e exercicioId são obrigatórios e devem ser números" });
  }

  try {
    const vinculo = await prisma.treinoExercicio.create({
      data: { treinoId, exercicioId }
    });

    res.status(201).json(vinculo);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ erro: "Este exercício já está vinculado a este treino" });
    }
    if (error.code === "P2003") {
      return res.status(404).json({ erro: "Treino ou exercício informado não existe" });
    }
    console.error(error);
    res.status(500).json({ erro: "Erro ao vincular exercício ao treino" });
  }
});

// Listar exercícios de um treino
app.get("/treinos/:id/exercicios", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: "ID do treino inválido" });
  }

  try {
    const treino = await prisma.treino.findUnique({
      where: { id },
      include: {
        exercicios: {
          include: { exercicio: true }
        }
      }
    });

    if (!treino) {
      return res.status(404).json({ erro: "Treino não encontrado" });
    }

    res.json(treino.exercicios.map((e) => e.exercicio));
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar exercícios do treino" });
  }
});

// Remover exercício de um treino
app.delete("/treinos/:id/exercicios/:exercicioId", async (req, res) => {
  const treinoId = parseInt(req.params.id);
  const exercicioId = parseInt(req.params.exercicioId);

  if (isNaN(treinoId) || isNaN(exercicioId)) {
    return res.status(400).json({ erro: "IDs inválidos" });
  }

  try {
    await prisma.treinoExercicio.delete({
      where: {
        treinoId_exercicioId: { treinoId, exercicioId }
      }
    });

    res.json({ mensagem: "Exercício removido do treino" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Exercício não está vinculado a este treino" });
    }
    console.error(error);
    res.status(500).json({ erro: "Erro ao remover exercício do treino" });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
