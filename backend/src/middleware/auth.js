const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Нет токена авторизации" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, isAdmin }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Токен недействителен или истёк" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Требуются права администратора" });
  }
  next();
}

// Для сокетов: достаём и проверяем токен из handshake.auth.token
function verifySocketToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { requireAuth, requireAdmin, verifySocketToken };
