# 📝 Todo API Server

API RESTful para gerenciamento de tarefas (to-do list), construída com Node.js, Express e MySQL.

## ⚡Funcionalidades

🔑 Autenticação de usuários com JWT (login e cadastro)

✅ CRUD de tarefas: criar, listar, atualizar e excluir

🗂️ Categorias: pessoais e globais, vinculadas às tarefas

📝 Subtarefas: gerenciamento de subtarefas dentro das tarefas

🔒 Proteção de rotas via middleware de autenticação

🛡️ Validações de dados e permissões de acesso




## 📂 Estrutura do Projeto

```
src/
  app.js
  server.js
  app/
    controllers/
      CategoryController.js
      SubtaskController.js
      TaskController.js
      UserController.js
    middlewares/
      authMiddleware.js
    models/
      CategoryModel.js
      SubTaskModel.js
      TaskModel.js
      UserModel.js
    repositories/
      CategoryRepository.js
      SubtaskRepository.js
      TaskRepository.js
      UserRepository.js
    routes/
      Routes.js
  database/
    conexao.js
    script/
      script_database.txt
  service/
    email/
.env
package.json
```

## 🚀 Endpoints Principais


### 👤 Usuário
| Método   | Rota                 | Descrição                  |
| -------- | -------------------- | -------------------------- |
| 🔑 POST  | `/api/login`         | Login do usuário           |
| 📝 POST  | `/api/register`      | Cadastro de usuário        |
| ✏️ PATCH | `/api/user/:id`      | Atualizar dados do usuário |
| 🔒 PATCH | `/api/user/pass/:id` | Alterar senha              |
| 🔍 GET   | `/api/user/:id`      | Buscar usuário             |
| ❌ DELETE | `/api/user/:id`      | Excluir usuário            |


### 📋 Tarefas

| Método    | Rota                      | Descrição                          |
| --------- | ------------------------- | ---------------------------------- |
| ➕ POST    | `/api/task`               | Criar tarefa                       |
| 📜 GET    | `/api/tasks/show`         | Listar todas as tarefas do usuário |
| 🔎 GET    | `/api/tasks/:id/show`     | Buscar tarefa por ID               |
| ✏️ PATCH  | `/api/tasks/update/:id`   | Atualizar tarefa                   |
| ✅ PATCH   | `/api/tasks/status/:id`   | Atualizar status da tarefa         |
| 🗂️ PATCH | `/api/tasks/category/:id` | Atualizar categoria da tarefa      |
| ❌ DELETE  | `/api/tasks/delete/:id`   | Excluir tarefa                     |


### 🗂️ Categorias

| Método   | Rota                  | Descrição           |
| -------- | --------------------- | ------------------- |
| 📜 GET   | `/api/categories`     | Listar categorias   |
| ➕ POST   | `/api/categories`     | Criar categoria     |
| ✏️ PATCH | `/api/categories/:id` | Atualizar categoria |
| ❌ DELETE | `/api/categories/:id` | Excluir categoria   |

### 📝 Subtarefas

| Método   | Rota                                     | Descrição                       |
| -------- | ---------------------------------------- | ------------------------------- |
| ➕ POST   | `/api/tasks/:taskId/subtasks`            | Criar subtarefa                 |
| 📜 GET   | `/api/tasks/:taskId/subtasks`            | Listar subtarefas de uma tarefa |
| ✏️ PATCH | `/api/tasks/:taskId/subtasks/:id`        | Atualizar subtarefa             |
| ✅ PATCH  | `/api/tasks/:taskId/subtasks/:id/status` | Atualizar status da subtarefa   |
| ❌ DELETE | `/api/tasks/:taskId/subtasks/:id`        | Excluir subtarefa               |

<br>

## ⚙️ Como Rodar

 Instale as dependências:

 1. Instale as dependências:
    ```
    npm install
 2. Configure o arquivo .env com as variáveis do MySQL e JWT.
 3. Execute o servidor:
    ```
    npm run dev
 4. Acesse a API em http://localhost:<PORTA_CONFIGURADA_NO_ENV>/api
  
## 📝 Observações

- Todas as rotas (exceto login e cadastro) exigem autenticação via JWT.

- Projeto pronto para integração com frontend (ex: React).

- Para testes, utilize ferramentas como Postman ou Insomnia.

<br/><br/>
**Desenvolvido por Bruno Lima Beserra**










