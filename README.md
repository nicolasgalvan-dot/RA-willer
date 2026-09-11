# StreamFit

## Instalação

```bash
npm install
```

## Configuração

Crie o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/streamfit"
```

## Banco de dados

```bash
npx prisma generate
npx prisma migrate dev --config src/.lib/prisma.config.ts --name init
```

## Executar

```bash
node src/server.js
```

## Rotas

### Treinos

**Criar treino**
```
POST /treinos
{ "nome": "Treino A", "objetivo": "Hipertrofia" }
```

**Listar treinos**
```
GET /treinos
```

**Atualizar treino**
```
PUT /treinos
{ "id": 1, "nome": "Treino A atualizado", "objetivo": "Força" }
```

**Excluir treino**
```
DELETE /treinos/:id
```

**Vincular exercício a treino**
```
POST /treinos/vincular
{ "treinoId": 1, "exercicioId": 1 }
```

**Listar exercícios de um treino**
```
GET /treinos/:id/exercicios
```

**Remover exercício de um treino**
```
DELETE /treinos/:id/exercicios/:exercicioId
```

### Exercícios

**Criar exercício**
```
POST /exercicios
{ "nome": "Supino reto", "grupoMuscular": "Peito" }
```

**Listar exercícios**
```
GET /exercicios
```
