import TaskRepository from '../repositories/TaskRepository.js';
import CategoryRepository from '../repositories/CategoryRepository.js';

class TasksController{

    async create(req, res) {
        const {title, description = '', category_id = 1} = req.body;
        const user_id = req.usuario.id;

        
        if (!title) {
            return res.status(400).json({ mensagem: 'Título é obrigatório.' });
        }
        if (!category_id || isNaN(Number(category_id))) {
            return res.status(400).json({ mensagem: 'Categoria inválida ou não fornecida.' });
        }

        const categoria = await CategoryRepository.findById(category_id);
            if (!categoria || (categoria.user_id !== null && categoria.user_id !== user_id)) {
                return res.status(403).json({ mensagem: 'Categoria inválida ou não permitida.' });
            }
        try {

            const resultado = await TaskRepository.create({
                title,
                description,
                category_id,
                user_id
            });

            if(!resultado || resultado.affectedRows === 0){
                return res.status(500).json({mensagem: 'Não foi possivel criar a tarefa.'})
            }

            return res.status(201).json({
                mensagem: 'Tarefa criada com sucesso!',
                resultado: resultado
            })

        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao criar tarefa.', erro: error});
        }
        
    }
    async readAll(req, res) {

        const user_id = req.usuario.id;

        try {
            const resultado = await TaskRepository.readAll(user_id);

            if(!resultado || resultado.length === 0){
                return res.status(404).json({ mensagem: 'Nenhuma tarefa encontrada para este usuário.' });
            }

            return res.status(200).json({ mensagem: 'Tarefas encontradas com sucesso', dados: resultado });

        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            return res.status(500).json({ mensagem: 'Erro ao buscar as tarefas.' });
        }

    }
    async readById(req, res) {
        const user_id = req.usuario.id;
        const {id} = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }
        try {
            
            const resultado = await TaskRepository.readById(id, user_id);

            if(!resultado || resultado.length === 0){
                console.log(resultado)
                return res.status(404).json({ mensagem: 'Não foi possivel localizar a tarefa' });
            }

            return res.status(200).json({ mensagem: 'Tarefa encontrada com sucesso', dados: resultado });
        } catch (error) {
            console.error('Erro ao buscar tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro ao buscar as tarefas.' });
        }

    }
    async update(req, res) {
        const {id} = req.params;
        const user_id = req.usuario.id;
        const dados_atualizados = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }

        if('title' in dados_atualizados){
            if (!dados_atualizados.title || dados_atualizados.title == '') {
                return res.status(400).json({ mensagem: 'O titulo é obrigatório.' });
            }
        }
        // if (!dados_atualizados.category_id){
        //     dados_atualizados.category_id = 1
        // }
        // if('category_id' in dados_atualizados){
        //     if (!dados_atualizados.category_id || dados_atualizados.category_id == '') {
        //         return res.status(400).json({ mensagem: 'A Categoria é obrigatória.' });
        //     }
            
        // }

        try {
            
            const resultado = await TaskRepository.update(dados_atualizados, id, user_id);

            if(!resultado || resultado.affectedRows == 0){
                console.log(resultado)
                return res.status(404).json({ mensagem: 'Não foi possivel atualizar a tarefa' });
            }

            return res.status(200).json({ 
                mensagem: 'Tarefa atualizada com sucesso',
                dados: dados_atualizados,
                id: id
            });

        } catch (error) {
             console.error('Erro ao atualizar tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao atualizar a tarefa.' });
        }   

    }
    async updateStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const user_id = req.usuario.id;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }

        if (typeof status !== 'boolean' && status !== 0 && status !== 1) {
            return res.status(400).json({ mensagem: 'Status inválido. Deve ser booleano ou 0/1.' });
        }

        // Garantir que o valor enviado ao banco seja 0 ou 1
        const valorStatus = status ? 1 : 0;

        try {
            const resultado = await TaskRepository.updateStatus(id, user_id, valorStatus);

            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Tarefa não encontrada ou sem permissão.' });
            }

            return res.status(200).json({
                mensagem: 'Status da tarefa atualizado com sucesso.',
                status: valorStatus
            });

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao atualizar o status.' });
        }
    }
    async updateCategory(req, res){
        const { id } = req.params;
        const { category_id  = 1} = req.body;
        const user_id = req.usuario.id;

        if(!id || isNaN(Number(id))){
            return res.status(400).json({ mensagem: 'ID da tarefa inválido.' });
        }

        if (!category_id || isNaN(Number(category_id))) {
            return res.status(400).json({ mensagem: 'Categoria inválida ou não fornecida.' });
        }

        try {

            const categoriaExiste = await CategoryRepository.findById(category_id);

            if (!categoriaExiste) {
                return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
            }

            const resultado = await TaskRepository.updateCategory(id, user_id, category_id);
            
            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Tarefa não encontrada ou sem permissão.' });
            }

            return res.status(200).json({
                mensagem: 'Categoria atualizada com sucesso.',
                nova_categoria: category_id
            });

        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao atualizar a categoria.', erro: error });
        }


    }
    async delete(req, res) {
        const {id} = req.params;
        const user_id = req.usuario.id;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }

        try {
            const resultado = await TaskRepository.delete(id, user_id);

            if(!resultado || resultado.affectedRows === 0){
                return res.status(404).json({ mensagem: 'Tarefa não encontrada ou você não tem permissão para deletar.' });
            }

            return res.status(200).json({ mensagem: 'Tarefa deletada com sucesso.', id: id });

        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao deletar a tarefa.' });
        }

    }

}

export default new TasksController();
