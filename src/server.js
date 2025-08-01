import app from './app.js';
import conexao  from './database/conexao.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

conexao.connect((error) =>{
    if(error){
        console.log(`Erro ao se conectar \n ${error}`);
    }else{
        console.log("Conexão bem sucedida");

        app.listen(PORT, () => {
            console.log(`Servidor escutando na porta: http://localhost:${PORT}`);
        })
    }

});
