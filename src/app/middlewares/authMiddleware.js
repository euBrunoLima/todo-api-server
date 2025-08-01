import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Exemplo: Authorization: Bearer token123
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }

    // Adiciona os dados do usuário no request para uso posterior
    req.usuario = usuario;

    next(); // libera para a próxima função (rota)
  });
}
