# StreamFit - Guia Passo a Passo Completo e Detalhado

---

# PARTE 1: TERMINAL 

### Passo 1: Entrar na pasta do projeto
No terminal do VS Code, digite:
```bash
cd ra-willer
```

---

### Passo 2: Instalar dependências
```bash
npm install
```

---

### Passo 3: Gerar tabelas no Banco de Dados (Prisma)
Execute estes 2 comandos, um por vez:
```bash
npx prisma generate --config src/.lib/prisma.config.ts
```
```bash
npx prisma migrate dev --config src/.lib/prisma.config.ts --name init
```

---

### Passo 4: Ligar a API
```bash
npm start
```
* **Confirmação na tela:** `Servidor rodando na porta 3333`
* 

---

#  PARTE 2: TESTES NO POSTMAN 

> 💡 **Regra geral do Postman para quando tiver Body (POST e PUT):**
> 1. Clique na aba **Body** (abaixo da barra da URL).
> 2. Marque a bolinha **raw**.
> 3. No canto direito da mesma linha, onde diz `Text`, mude para **JSON**.
> 4. Cole o texto JSON.
> 5. Clique no botão azul **Send**.

---

### Passo 5: Criar um Exercício
1. No Postman, abra uma nova aba (botão `+`).
2. **Método:** Selecione **`POST`**.
3. **URL:** Cole `http://localhost:3333/exercicios` *(atenção: sem acento no i)*.
4. **Body:** Clique em **Body** -> marque **raw** -> selecione **JSON**.
5. **Conteúdo do Body:**
```json
{
  "nome": "Supino reto",
  "grupoMuscular": "Peito"
}
```
6. Clique no botão **Send**.
7. **Status esperado:** `201 Created` (vai retornar o exercício com `"id": 1`).

---

### Passo 6: Listar todos os Exercícios
1. Abra uma nova aba (botão `+`).
2. **Método:** Deixe como **`GET`**.
3. **URL:** Cole `http://localhost:3333/exercicios`
4. **Body:** Não precisa preencher nada.
5. Clique no botão **Send**.
6. **Status esperado:** `200 OK` (vai listar o Supino reto que você criou).

---

### Passo 7: Criar um Treino
1. Abra uma nova aba (botão `+`).
2. **Método:** Selecione **`POST`**.
3. **URL:** Cole `http://localhost:3333/treinos`
4. **Body:** Clique em **Body** -> marque **raw** -> selecione **JSON**.
5. **Conteúdo do Body:**
```json
{
  "nome": "Treino A",
  "objetivo": "Hipertrofia"
}
```
6. Clique no botão **Send**.
7. **Status esperado:** `201 Created` (vai retornar o treino com `"id": 1`).

---

### Passo 8: Listar todos os Treinos
1. Abra uma nova aba (botão `+`).
2. **Método:** Deixe como **`GET`**.
3. **URL:** Cole `http://localhost:3333/treinos`
4. **Body:** Não precisa preencher nada.
5. Clique no botão **Send**.
6. **Status esperado:** `200 OK` (mostra o `Treino A` com `exercicios: []`).

---

### Passo 9: Vincular o Exercício ao Treino
1. Abra uma nova aba (botão `+`).
2. **Método:** Selecione **`POST`**.
3. **URL:** Cole `http://localhost:3333/treinos/vincular`
4. **Body:** Clique em **Body** -> marque **raw** -> selecione **JSON**.
5. **Conteúdo do Body:**
```json
{
  "treinoId": 1,
  "exercicioId": 1
}
```
6. Clique no botão **Send**.
7. **Status esperado:** `201 Created` (confirmação com `"id": 1`, `"treinoId": 1`, `"exercicioId": 1`).

---

### Passo 10: Listar Exercícios de um Treino Específico
1. Abra uma nova aba (botão `+`).
2. **Método:** Deixe como **`GET`**.
3. **URL:** Cole `http://localhost:3333/treinos/1/exercicios`
4. **Body:** Não precisa preencher nada.
5. Clique no botão **Send**.
6. **Status esperado:** `200 OK` (mostra que o Supino reto está dentro do Treino 1).

---

### Passo 11: Atualizar um Treino
1. Abra uma nova aba (botão `+`).
2. **Método:** Selecione **`PUT`**.
3. **URL:** Cole `http://localhost:3333/treinos`
4. **Body:** Clique em **Body** -> marque **raw** -> selecione **JSON**.
5. **Conteúdo do Body:**
```json
{
  "id": 1,
  "nome": "Treino A atualizado",
  "objetivo": "Força"
}
```
6. Clique no botão **Send**.
7. **Status esperado:** `200 OK` (retorna o treino com nome e objetivo alterados).

---

### Passo 12: Desvincular Exercício do Treino
1. Abra uma nova aba (botão `+`).
2. **Método:** Selecione **`DELETE`**.
3. **URL:** Cole `http://localhost:3333/treinos/1/exercicios/1`
4. **Body:** Não precisa preencher nada.
5. Clique no botão **Send**.
6. **Status esperado:** `200 OK` (mensagem: `"Exercício removido do treino"`).

---

### Passo 13: Excluir o Treino
1. Abra uma nova aba (botão `+`).
2. **Método:** Selecione **`DELETE`**.
3. **URL:** Cole `http://localhost:3333/treinos/1`
4. **Body:** Não precisa preencher nada.
5. Clique no botão **Send**.
6. **Status esperado:** `200 OK` (mensagem: `"Treino excluído"`).
