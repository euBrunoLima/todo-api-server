import { Router } from "express";
import { autenticarToken } from "../middlewares/authMiddleware.js";
import UserController from "../controllers/UserController.js";
import TaskController from '../controllers/TaskController.js'
import CategoryController from "../controllers/CategoryController.js";
import SubtaskController from "../controllers/SubtaskController.js"

const routes = Router();

//Rotas do User
routes.post('/login', UserController.login);
routes.post('/register', UserController.register);
routes.patch('/user/:id', autenticarToken, UserController.update);
routes.delete('/user/:id', autenticarToken, UserController.delete);
routes.get('/user/:id', UserController.show)
routes.patch('/user/pass/:id', autenticarToken, UserController.updatePassword);

//Rotas das Tasks
routes.post('/task', autenticarToken, TaskController.create);
routes.get('/tasks/show', autenticarToken, TaskController.readAll);
routes.get('/tasks/:id/show', autenticarToken, TaskController.readById);
routes.patch('/tasks/update/:id', autenticarToken, TaskController.update);
routes.patch('/tasks/status/:id', autenticarToken, TaskController.updateStatus);
routes.patch('/tasks/category/:id', autenticarToken, TaskController.updateCategory);
routes.delete('/tasks/delete/:id', autenticarToken, TaskController.delete);

//Rotas das categories
routes.get('/categories', autenticarToken, CategoryController.read);
routes.post('/categories', autenticarToken, CategoryController.create);
routes.patch('/categories/:id', autenticarToken, CategoryController.update);
routes.delete('/categories/:id', autenticarToken, CategoryController.delete);

// Rotas das Subtasks
routes.post('/tasks/:taskId/subtasks', autenticarToken, SubtaskController.create);
routes.get('/tasks/:taskId/subtasks', autenticarToken, SubtaskController.readAll);
// routes.get('/tasks/:taskId/subtasks/:id', autenticarToken, SubtaskController.readById);
routes.patch('/tasks/:taskId/subtasks/:id', autenticarToken, SubtaskController.update);
routes.patch('/tasks/:taskId/subtasks/:id/status', autenticarToken, SubtaskController.updateStatus);
routes.delete('/tasks/:taskId/subtasks/:id', autenticarToken, SubtaskController.delete);


export default routes;
