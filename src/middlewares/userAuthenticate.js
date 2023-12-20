
//funcion para verificar autenticacion de usuarios
function checkAuthenticated(req, res, next) {
    const token = req.headers['authorization'];
    console.log(token);

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    });
}

export default checkAuthenticated;