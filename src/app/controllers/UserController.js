import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';
import TaskRepository from '../repositories/TaskRepository.js';
import SubtaskRepository from '../repositories/SubtaskRepository.js';

import dotenv from 'dotenv';
import CategoryRepository from '../repositories/CategoryRepository.js';
dotenv.config();

class UserController{

    async login(req, res){
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensagem: 'Email e senha obrigatórios.' });
        }

        try{
            const usuario = await UserRepository.findByEmail(email)

            if(!usuario){
                return res.status(404).json({mensagem: 'Usuário não encontrado.'})
            }

            const senhaCorreta = await bcrypt.compare(password, usuario.password)

            if(!senhaCorreta){
                return res.status(401).json({mensagem: 'senha incorreta.'})
            }

            const token = jwt.sign(
                {id: usuario.id, email: usuario.email},
                process.env.JWT_SECRET,
                {expiresIn: '2h'}
            )

            //Retorno do usuario logado
            return res.status(200).json({
                mensagem: 'login bem sucedido',
                token: token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.name,
                    email: usuario.email
                }
            })

        }catch(erro){
            console.log(erro)
            return res.status(500).json({mensagem: 'Erro interno no servidor'})
        }

    }
    async register(req, res){
        
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
        }
        if(password.length < 6){
            return res.status(400).json({ mensagem: 'A senha deve conter no minimo 6 caracteres' });

        }
        const verificaEmail =  await UserRepository.findByEmail(email)

        if(verificaEmail){
            return res.status(400).json({ mensagem: 'O email informado já está cadastrado' });
        }

        try{
            const senhaCriptografada = await bcrypt.hash(password, 10)

            const user = {
                name,
                email,
                password: senhaCriptografada
            }
            const resultado = await UserRepository.create(user)
            
             if(!resultado || resultado.affectedRows === 0){
                return res.status(500).json({mensagem: 'Não foi possivel criar a tarefa.'})
            }

            return res.status(201).json({
                mensagem: 'Usuario criado com sucesso!',
                user:{
                    id: resultado.insertId,
                    name: user.name,
                    email: user.email
                }
            })

        }catch(erro){
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
        }

    }
    async update(req, res){
        const {id} = req.params;
        const dados_atualizados = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }

        if(req.usuario.id != id){
            return res.status(403).json({ mensagem: 'Você só pode alterar seus próprios dados.' });
        }

        if('name' in dados_atualizados){
            if (!dados_atualizados.name || dados_atualizados.name == '') {
                return res.status(400).json({ mensagem: 'O nome é obrigatório.' });
            }
        }
       
        if('email' in dados_atualizados){

            const verificaEmail =  await UserRepository.findByEmail(dados_atualizados.email.trim())

            if(verificaEmail && verificaEmail.id != id){
                return res.status(400).json({ mensagem: 'O email informado já está cadastrado' });
            }
            
            if (!dados_atualizados.email || dados_atualizados.email == '') {
                return res.status(400).json({ mensagem: 'O email é obrigatório.' });
            }
        }
        

        try {
            const resultado = await UserRepository.update(dados_atualizados, id);
            if (!resultado || resultado.affectedRows === 0 )  {
                return res.status(404).json({ mensagem: 'Usuário não encontrado você não tem permissão para alterar' });
            }

            return res.status(200).json({
                mensagem: 'Perfil atualizado com sucesso',
                dados_atualizados
            });

        }catch (erro) {
            console.error(erro);
            return res.status(500).json({ mensagem: 'Erro ao atualizar informações.' });
        }
            
    }
    async delete(req, res){
        const {id} = req.params;
        const {senha} = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }
        if(req.usuario.id != id){
            return res.status(403).json({ mensagem: 'Você só pode alterar seus próprios dados.' });
        }
        if(!senha){
            return res.status(400).json({ mensagem: 'Senha atual é obrigatória para excluir a conta.' });
        }
    
        try {
            
            const usuario = await UserRepository.findById(id);

            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.password)

            if(!senhaValida){
                return res.status(401).json({ mensagem: 'Senha incorreta.' });
            }

            try {
                await SubtaskRepository.deleteByUserId(id);
            } catch (error) {
                console.log(error)
            }
            try {
                await TaskRepository.deleteALL(id);

            } catch (error) {
                console.log(error)
            }
            try {
                await CategoryRepository.deleteALByUser(id);
            } catch (error) {
                console.log(error)
            }
            
            
            const resultado = await UserRepository.delete(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            return res.status(200).json({ mensagem: 'Conta deletada com sucesso' });
            

        } catch (error) {
            console.log(error)
            return res.status(500).json({ mensagem: 'Erro ao deletar conta.' });
          
        }
    }
    // talvez show() seja deletado. metodo redundante
    async show(req, res){
        const {id} = req.params;
        
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }

        try{
            const resultado = await UserRepository.show(id)
            
           if (!resultado || resultado.length === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            return res.status(200).json({ mensagem: 'Usuario encontrado com sucesso', dados: resultado });
        }catch (error){
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({ mensagem: 'Erro ao buscar o usuario.' });
        }
    }
    async updatePassword(req, res){
        const {id} = req.params
        const {senhaAtual, novaSenha} = req.body;
          
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensagem: 'ID inválido ou não fornecido.' });
        }
        if(req.usuario.id != id){
            return res.status(403).json({ mensagem: 'Você só pode alterar seus próprios dados.' });
        }
        if(!senhaAtual){
            return res.status(400).json({ mensagem: 'Senha atual é obrigatória para alterar a senha.' });
        }
        if (!novaSenha) {
            return res.status(400).json({ mensagem: 'Uma nova senha é obrigatória se quiser alterar.' });
        }

        try {
            const usuario = await UserRepository.findById(id);

            if (!usuario ||  usuario.length === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }
            const senhaValida = await bcrypt.compare(senhaAtual, usuario.password);

            if(!senhaValida){
                return res.status(401).json({ mensagem: 'Senha incorreta.' });
            }

            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
            const resultado = await UserRepository.updatePassword({password: senhaCriptografada}, id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado. Erro ao alterar a senha' });
            }

            return res.status(200).json({ mensagem: 'Senha alterada com sucesso.' });
            
        } catch (error) {
            console.error('Erro ao alterar a senha', error);
            return res.status(500).json({ mensagem: 'Erro ao alterar a senha. Erro interno', erro: error });
        }

    }
}

export default new UserController();
