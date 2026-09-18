const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Você precisa entrar para acessar esta área.' });
  }

  return next();
};

module.exports = {
  isAuthenticated
};
