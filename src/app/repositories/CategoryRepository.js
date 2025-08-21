import conexao from "../../database/conexao.js";

class CategoryRepository{

    async create(name, user_id) {
        const sql = `INSERT INTO categories (name, user_id) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [name, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
            });
        })

    }
    async findByNameAndUser(name, user_id) {
        const sql = `SELECT * FROM categories WHERE name = ? AND (user_id = ? OR user_id IS NULL)`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [name, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado[0]);
            });
        });
    }       
    async findAllByUser(user_id) {
        const sql = `SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY name;`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }
    //metodo auxiliar
    async findById(category_id) {
        const sql = 'select * from categories where id = ?;';
        return new Promise((resolve, reject) => {
            conexao.query(sql, [category_id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado[0]);
            });
        })

    }
    async update(name, id, user_id) {
        const sql = `UPDATE categories SET name = ? WHERE id = ? AND user_id = ?`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [name, id, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }
    async delete(id, user_id) {
        const sql = `DELETE FROM categories WHERE id = ? AND user_id = ?`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [id, user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }
    async isCategoryInUse(id) {
    const sql = `SELECT COUNT(*) AS total FROM tasks WHERE category_id = ?`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [id], (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado[0].total > 0); // retorna true se houver tarefas com essa categoria
            });
        });
    }
    async deleteALByUser(user_id){
        const sql = `delete from categories where user_id = ?`
        return new Promise((resolve, reject) => {
            conexao.query(sql, [user_id], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            })
        })
    }


}

export default new CategoryRepository();
