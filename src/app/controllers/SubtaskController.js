import TaskRepository from '../repositories/TaskRepository.js';
import SubtaskRepository from '../repositories/SubtaskRepository.js';

class SubtaskController{

    async create(req, res) {
        const { taskId } = req.params;
        const { title } = req.body;
        const userId = req.usuario.id;

        if (!taskId || isNaN(Number(taskId))) {
            return res.status(400).json({ mensagem: 'ID da task inválido ou não fornecido.' });
        }
        if (!title || title == '') {
            return res.status(400).json({ mensagem: 'Título é obrigatório.' });
        }

        try {
            const task = await TaskRepository.readById(taskId, userId);

            if (!task || task.user_id !== userId) {
                return res.status(403).json({ mensagem: 'Acesso negado à task.' });
            }

            const resultado = await SubtaskRepository.create({ title, task_id: taskId });

            if(!resultado || resultado.affectedRows === 0){
                return res.status(500).json({mensagem: 'Não foi possivel criar a sub-tarefa.'})
            }

            return res.status(201).json({ mensagem: 'Sub-tarefa criada com sucesso', dados: resultado });

        } catch (error) {
            console.error('Erro ao criar a sub-tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao criar a sub-tarefa.', erro: error});
        }
        
    }
    async readAll(req, res) {
        const { taskId } = req.params;
        const userId = req.usuario.id;

        if (!taskId || isNaN(Number(taskId))) {
            return res.status(400).json({ mensagem: 'ID da task inválido ou não fornecido.' });
        }

        try {
            const task = await TaskRepository.readById(taskId, userId);

            if (!task || task.user_id !== userId) {
                return res.status(403).json({ mensagem: 'Acesso negado à task.' });
            }

            const resultado = await SubtaskRepository.findAllByTaskId(taskId);

            if(!resultado || resultado.length == 0){
                return res.status(404).json({ mensagem: 'Nenhuma sub-tarefa encontrada para esta tarefa.' });
            }

            return res.status(200).json({ mensagem: 'sub-tarefas encontradas com sucesso', dados: resultado });

        } catch (error) {
            console.error('Erro Interno. Erro ao buscar sub-tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro Interno. Erro ao buscar sub-tarefa', erro: error });
        }
    }
    async update(req, res) {
        const { id, taskId } = req.params;
        const title  = req.body;
        const userId = req.usuario.id;

        if (!id || isNaN(Number(id)) || !taskId || isNaN(Number(taskId))) {
            return res.status(400).json({ mensagem: 'ID da task ou subtask inválido.' });
        }

        if (!title || title.title.trim() === '') {
            return res.status(400).json({ mensagem: 'Título é obrigatório.' });
        }

        try {
            const task = await TaskRepository.readById(taskId, userId);
            if (!task || task.user_id !== userId) {
                return res.status(403).json({ mensagem: 'Acesso negado à task.' });
            }

            const resultado = await SubtaskRepository.update(id, taskId, title);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Subtarefa não encontrada ou não atualizada.' });
            }

            return res.status(200).json({
                mensagem: 'Subtarefa atualizada com sucesso.',
                id,
                titulo_atualizado: title.title
            });

        } catch (error) {
            return res.status(500).json({ mensagem: 'Erro ao atualizar a subtarefa.', erro: error });
        }
    }
    async updateStatus(req, res) {
        const { id, taskId } = req.params;
        const { status } = req.body;
        const userId = req.usuario.id;

        if (typeof status !== 'boolean') {
            return res.status(400).json({ mensagem: 'Status deve ser verdadeiro ou falso.' });
        }

        try {
            const task = await TaskRepository.readById(taskId, userId);
            if (!task || task.user_id !== userId) {
                return res.status(403).json({ mensagem: 'Acesso negado à task.' });
            }

            const resultado = await SubtaskRepository.updateStatus(id, taskId, status);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Subtarefa não encontrada ou não atualizada.' });
            }

            return res.status(200).json({ mensagem: 'Status da subtarefa atualizado com sucesso.', status });

        } catch (error) {
            return res.status(500).json({ mensagem: 'Erro ao atualizar o status da subtarefa.', erro: error });
        }
    }
    async delete(req, res) {
    const { id, taskId } = req.params;
    const userId = req.usuario.id;

    if (!id || isNaN(Number(id)) || !taskId || isNaN(Number(taskId))) {
        return res.status(400).json({ mensagem: 'ID da task ou subtask inválido.' });
    }

    try {
        const task = await TaskRepository.readById(taskId, userId);
        if (!task || task.user_id !== userId) {
            return res.status(403).json({ mensagem: 'Acesso negado à task.' });
        }

        const resultado = await SubtaskRepository.delete(id, taskId);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Subtarefa não encontrada ou não foi deletada.' });
        }

        return res.status(200).json({ mensagem: 'Subtarefa deletada com sucesso.' });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao deletar a subtarefa.', erro: error });
    }
    }
}

export default new SubtaskController();
