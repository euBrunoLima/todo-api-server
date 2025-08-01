import CategoryRepository from "../repositories/CategoryRepository.js";


class CategoryController{

    async create(req, res) {
        const {name} = req.body;
        const user_id = req.usuario.id;

        if(!name || name == ''){
            return res.status(400).json({ mensagem: 'Nome obrigatório.' });
        }

        try {
            const existente = await CategoryRepository.findByNameAndUser(name, user_id);
            if (existente){
                return res.status(400).json({ mensagem: 'Categoria já existe.' });
            }

            const resultado =  await CategoryRepository.create(name, user_id);

            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Não foi possivel criar a categoria. Usuario não encontrado ou sem permissão.' });
            }

            res.status(201).json({
                mensagem: 'Categoria criada com sucesso.' ,
                name: name
            });

        } catch (error) {
            console.error('Erro ao criar a categoria:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao criar a categoria.', erro: error });
        }
    }    
    async read(req, res) {
        const user_id = req.usuario.id;

        try {
            const resultado = await CategoryRepository.findAllByUser(user_id);

            if(!resultado || resultado.length === 0){
                return res.status(404).json({ mensagem: 'Nenhuma categoria encontrada (nem globais, nem pessoais)' });
            }

            const globais = resultado.filter((cat) => cat.user_id === null);
            const pessoais = resultado.filter((cat) => cat.user_id == user_id)

            
            return res.status(200).json({
                mensagem: 'Categorias encontradas com sucesso',
                categorias_pessoais: pessoais,
                categorias_globais: globais,
                todas_categorias: resultado
            });

        }catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return res.status(500).json({ mensagem: 'Erro ao buscar categorias.', erro: error });
        }
    }
    async readAll(req, res) {

    }
    async update(req, res) {
        const {name} = req.body;
        const {id} = req.params;
        const user_id = req.usuario.id;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }

        if(!name){
            return res.status(400).json({ mensagem: 'Nome obrigatório.' });
        }

        try {

            const resultado =  await CategoryRepository.update(name, id, user_id);

            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Não foi possivel editar a categoria. Usuario não encontrado ou sem permissão.' });
            }

            res.status(201).json({
                mensagem: 'Categoria aditada com sucesso.' ,
                name: name
            });
            
        } catch (error) {
            console.error('Erro ao editar a categoria:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao editar a categoria.', erro: error });
        }
    }
    async delete(req, res) {
        const user_id = req.usuario.id;
        const {id} = req.params;
        
        try {
            const emUso = await CategoryRepository.isCategoryInUse(id);
            
            if (emUso) {
                return res.status(400).json({ mensagem: 'Categoria vinculada a tarefas. Remova ou edite as tarefas antes de excluir.' });
            }
            const resultado = await CategoryRepository.delete(id, user_id);

            if(!resultado || resultado.affectedRows === 0){
                return res.status(404).json({ mensagem: 'Nenhuma categoria encontrada ou não foi possivel deletar a categoria' });
            }

            res.status(201).json({
                mensagem: 'Categoria deletada com sucesso.' ,
                resultado: resultado
            });

        } catch (error) {
            console.error('Erro ao deletar a categoria:', error);
            return res.status(500).json({ mensagem: 'Erro interno ao deletar a categoria.', erro: error });
        }

    }
}

export default new CategoryController();
