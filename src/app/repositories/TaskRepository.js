import conexao from '../../database/conexao.js';

class TasksRepository{

    create(task) {
        const sql = 'insert into tasks (title, description, category_id, user_id) values (?,?,?,?);'
        const valores = [task.title, task.description, task.category_id, task.user_id];

        return new Promise((resolve, reject) => {
            conexao.query(sql, valores, (erro, resultado) => {
                if(erro) return reject(erro)
                return resolve(resultado);
            })
        })
    }
    readAll(id) {
        const sql = 'select * from tasks where user_id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, id, (erro, resultado) => {
                if(erro) return reject(erro)
                return resolve(resultado) 
            })
        })
    }
    readById(task_id, user_id){
        const sql = 'select * from tasks where id = ?  and user_id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, [task_id, user_id], (erro, resultado) => {
                if(erro) return reject(erro)
                return resolve(resultado[0]) 
            })
        })

    }

    update(dadosAtualizados, id, user_id) {
        const sql = 'update tasks set ? where id = ? and user_id = ?;'
        
        return new Promise((resolve, reject) => {
            conexao.query(sql, [dadosAtualizados, id, user_id], (erro, resultado) =>{
                if(erro) return reject(erro)
                return resolve(resultado)
            })
        })
    }
    updateStatus(id, user_id, status) {
        const sql = 'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?';
        return new Promise((resolve, reject) => {
            conexao.query(sql, [status, id, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        });
    }
    updateCategory(task_id, user_id, category_id){
        const sql = 'update tasks set category_id = ? where id = ? and user_id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, [category_id, task_id, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        })
    }
    delete(id, user_id) {
        const sql = 'delete from tasks where id = ? and user_id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, [id, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        });
    }
}

export default new TasksRepository();