const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const Usuario = require('../models/Usuario.js');
const bycript = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const router = Router();

router.post('/', 
    [
        check('email', 'invalid.email').isEmail(),
        check('password', 'invalid.password').not().isEmpty(),
    ], 
    async function (req, res){

        try{

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ mensaje: errors.array() });
            }

            const usuario = await Usuario.findOne({ email: req.body.email});
            if(!usuario){
                return res.status(400).json('Usuario o contraseña incorrecta');
            }            

            const esIgual = bycript.compareSync(req.body.password, usuario.password);

            if(!esIgual) {
                return res.status(400).json('Usuario o contraseña incorrecta');
            }

            // Generar token
            const token = generarJWT(usuario);

            res.json({
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                access_token: token
            });

        }catch(error){
            console.log(error);
            res.status(500).send('Ocurrio un error');
        }
    }
);

module.exports = router;