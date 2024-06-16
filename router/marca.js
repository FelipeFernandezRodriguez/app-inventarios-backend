const {Router} = require('express');
const {validationResult, check} = require('express-validator');
const Marca = require('../models/Marca');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.get('/', [ validarJWT, validarRolAdmin ], async function(req, res){
    try{

        const marca = await Marca.find();
        res.send(marca);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});

router.post('/', [ validarJWT, validarRolAdmin ], 
    [
        check('nombre', 'nombre.requerido').not().isEmpty(),
        check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']),
    ],
    async function(req, res){
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ messages: errors.array() });
            }

            let marca = new Marca();

            marca.nombre = req.body.nombre;
            marca.estado = req.body.estado;
            marca.fechaCreacion = new Date;
            marca.fechaActualizacion = new Date;

            marca = await marca.save();

            res.send(marca);

        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrio un error');
        }
    }
);

router.put('/:marcaId', [ validarJWT, validarRolAdmin ], 
    [
        check('nombre', 'nombre.requerido').not().isEmpty(),
        check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']),
    ],
    async function(req, res){
        try {
            
            let marca = await Marca.findById(req.params.marcaId);
            if(!marca){
                return res.send('Marca no existe');
            }

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ messages: errors.array() });
            }

            marca.nombre = req.body.nombre;
            marca.estado = req.body.estado;
            marca.fechaActualizacion = new Date();

            marca = await marca.save();

            res.send(marca);

        } catch (error) {
            console.log(error);
            res.send('Ocurrio un error');
        }
    }
);

router.get('/:marcaId', [ validarJWT, validarRolAdmin ], async function(req, res){
    try{

        const marca = await Marca.findById(req.params.marcaId);
        if(!marca){
            return res.status(404).send('Marca no existe');
        }

        res.send(marca);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al consultar la marca');
    }
});

module.exports = router;