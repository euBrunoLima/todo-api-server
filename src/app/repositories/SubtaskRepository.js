import conexao from '../../database/conexao.js';

class SubTaskRepository{

    create(subtask) {
        const sql = 'insert into subtasks (title, task_id) values (?,?);'
        const valores = [subtask.title, subtask.task_id];

        return new Promise((resolve, reject) => {
            conexao.query(sql, valores, (erro, resultado) => {
                if(erro) return reject(erro)
                return resolve(resultado);
            })
        })
    }  
    findAllByTaskId(task_id) {
        const sql = 'SELECT * FROM subtasks WHERE task_id = ?';
        return new Promise((resolve, reject) => {
            conexao.query(sql, task_id, (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        });
    }
    findById(id) {
        const sql = 'SELECT * FROM subtasks WHERE id = ?';
        return new Promise((resolve, reject) => {
            conexao.query(sql, [id], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado[0]); // retorna apenas um objeto
            });
        });
    }
    update(id, task_id, novosDados) {
        const sql = 'UPDATE subtasks SET title = ? WHERE id = ? AND task_id = ?';
        const valores = [novosDados.title, id, task_id];

        return new Promise((resolve, reject) => {
            conexao.query(sql, valores, (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        });
    }
    updateStatus(id, task_id, status) {
        const sql = 'UPDATE subtasks SET status = ? WHERE id = ? AND task_id = ?';
        return new Promise((resolve, reject) => {
            conexao.query(sql, [status, id, task_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        });
    }
    delete(id, task_id) {
        const sql = 'delete from subtasks where id = ? and task_id = ?;'
        return new Promise((resolve, reject) => {
            conexao.query(sql, [id, task_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        });
    }
    
    deleteByUserId(userId) {
        const sql = `
            DELETE subtasks FROM subtasks
            INNER JOIN tasks ON subtasks.task_id = tasks.id
            WHERE tasks.user_id = ?;
        `;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [userId], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }
}

export default new SubTaskRepository();