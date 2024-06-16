const jwt = require('jsonwebtoken');

const generarJWT = (usuario) => {

    const payload = { _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        estado: usuario.estado,
        password: usuario.password,
        rol: usuario.rol };

    const token = jwt.sign(payload, '1234567', { expiresIn: '72h'});

    return token;
}

module.exports = { generarJWT, }