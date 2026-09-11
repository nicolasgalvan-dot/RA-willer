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

app.post("/treinos", async (req, res) => {
  const { nome, objetivo } = req.body;

  try {
    const treino = await prisma.treino.create({
      data: { nome, objetivo }
    });

    res.json(treino);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar treino" });
  }
});

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
    res.status(500).json({ erro: "Erro ao listar treinos" });
  }
});

app.post("/exercicios", async (req, res) => {
  const { nome, grupoMuscular } = req.body;

  try {
    const exercicio = await prisma.exercicios.create({
      data: { nome, grupoMuscular }
    });

    res.json(exercicio);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar exercício" });
  }
});

app.get("/exercicios", async (req, res) => {
  try {
    const exercicios = await prisma.exercicios.findMany();

    res.json(exercicios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar exercícios" });
  }
});

app.post("/treinos/vincular", async (req, res) => {
  const { treinoId, exercicioId } = req.body;

  try {
    const vinculo = await prisma.treinoExercicio.create({
      data: { treinoId, exercicioId }
    });

    res.json(vinculo);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao vincular exercício ao treino" });
  }
});

app.get("/treinos/:id/exercicios", async (req, res) => {
  const id = parseInt(req.params.id);

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
    res.status(500).json({ erro: "Erro ao listar exercícios do treino" });
  }
});

app.put("/treinos", async (req, res) => {
  const { id, nome, objetivo } = req.body;

  try {
    const treino = await prisma.treino.update({
      where: { id },
      data: { nome, objetivo }
    });

    res.json(treino);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar treino" });
  }
});

app.delete("/treinos/:id/exercicios/:exercicioId", async (req, res) => {
  const treinoId = parseInt(req.params.id);
  const exercicioId = parseInt(req.params.exercicioId);

  try {
    await prisma.treinoExercicio.delete({
      where: {
        treinoId_exercicioId: { treinoId, exercicioId }
      }
    });

    res.json({ mensagem: "Exercício removido do treino" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao remover exercício do treino" });
  }
});

app.delete("/treinos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.treino.delete({
      where: { id }
    });

    res.json({ mensagem: "Treino excluído" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir treino" });
  }
});

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
