const {Router} = require('express');
const {validationResult, check} = require('express-validator');
const TipoEquipo = require('../models/TipoEquipo');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.get('/', [ validarJWT, validarRolAdmin ], async function(req, res){
    try{

        const tipos = await TipoEquipo.find();
        res.send(tipos);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});

router.post('/', [ validarJWT, validarRolAdmin ], 
    [
        check('nombre', 'invalid.nombre').not().isEmpty(),
        check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    ],
    async function(req, res){
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ messages: errors.array() });
            }

            let tipoEquipo = new TipoEquipo();

            tipoEquipo.nombre = req.body.nombre;
            tipoEquipo.estado = req.body.estado;
            tipoEquipo.fechaCreacion = new Date;
            tipoEquipo.fechaActualizacion = new Date;

            tipoEquipo = await tipoEquipo.save();

            res.send(tipoEquipo);

        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrio un error');
        }
    }
);

router.put('/:tipoEquipoId', [ validarJWT, validarRolAdmin ], 
    [
        check('nombre', 'nombre.requerido').not().isEmpty(),
        check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']),
    ],
    async function(req, res){
        try {
            
            let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
            if(!tipoEquipo){
                return res.send('Tipo equipo no existe');
            }

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ messages: errors.array() });
            }

            tipoEquipo.nombre = req.body.nombre;
            tipoEquipo.estado = req.body.estado;
            tipoEquipo.fechaActualizacion = new Date();

            tipoEquipo = await tipoEquipo.save();

            res.send(tipoEquipo);

        } catch (error) {
            console.log(error);
            res.send('Ocurrio un error');
        }
    }
);

router.get('/:tipoEquipoId', [ validarJWT, validarRolAdmin ], async function(req, res){
    try{

        const tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
        if(!tipoEquipo){
            return res.status(404).send('Tipo de equipo no existe');
        }

        res.send(tipoEquipo);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al consultar el tipo de equipo');
    }
});

module.exports = router;