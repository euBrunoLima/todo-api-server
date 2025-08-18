import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      if (erro.name === 'TokenExpiredError') {
        return res.status(401).json({ mensagem: 'Token expirado.' });
      } else {
        return res.status(403).json({ mensagem: 'Token inválido.' });
      }
    }

    req.usuario = usuario;
    next();
  });
}
