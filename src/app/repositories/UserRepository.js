import conexao from '../../database/conexao.js';

class UserRepository{

    findByEmail(email){
        const sql = 'select * from users where email = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, email, (erro, resultado) =>{
                if(erro) return reject(erro)
                resolve(resultado[0])
                
            })
        })
    }
    findById(id){
        const sql = 'select * from users where id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, id, (erro, resultado) =>{
                if(erro) return reject(erro)
                return resolve(resultado[0]);
            })
        })
        
    }
    create(usuario){
        const sql = 'insert into users (name, email, password) values (?,?,?);'
        const values = [usuario.name, usuario.email, usuario.password]
        return new Promise((resolve, reject) => {
            conexao.query(sql, values, (erro, resultado) =>{
                if(erro) return reject(erro)
                return resolve(resultado)
            })
        })
    }
    update(dadosAtualizados, id){
        const sql = 'update users set ? where id = ?;'
        
        return new Promise((resolve, reject) => {
            conexao.query(sql, [dadosAtualizados, id], (erro, resultado) =>{
                if(erro) return reject(erro)
                return resolve(resultado)
            })
        })
        
    }
    delete(id){
        const sql = 'delete from users where id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, id, (erro, resultado) =>{
                if(erro) return reject(erro)
                return resolve(resultado)
            })
        })
    }
    //Talvez o metodo show() seja deletado, redundancia
    show(id){
        const sql = 'select id, name, email from users where id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, id, (erro, resultado) => {
                if(erro) return reject(erro)
                return resolve(resultado)
            })
        })
    }
    updatePassword(novaSenha, id){
        const sql = 'update users set ? where id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, [novaSenha, id], (erro, resultado) => {
            if(erro) return reject(erro)
            return resolve(resultado)
        })
        })

    }
}

export default new UserRepository();