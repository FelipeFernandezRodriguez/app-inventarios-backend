const {Router} = require('express');
const {validationResult, check} = require('express-validator');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.get('/', [ validarJWT, validarRolAdmin ], async function(req, res){
    try{

        const tipos = await EstadoEquipo.find();
        res.send(tipos);

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

            let estadoEquipo = new EstadoEquipo();

            estadoEquipo.nombre = req.body.nombre;
            estadoEquipo.estado = req.body.estado;
            estadoEquipo.fechaCreacion = new Date;
            estadoEquipo.fechaActualizacion = new Date;

            estadoEquipo = await estadoEquipo.save();

            res.send(estadoEquipo);

        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrio un error');
        }
    }
);

router.put('/:estadoEquipoId', [ validarJWT, validarRolAdmin ], 
    [
        check('nombre', 'nombre.requerido').not().isEmpty(),
        check('estado', 'estado.requerido').isIn(['Activo', 'Inactivo']),
    ],
    async function(req, res){
        try {
            
            let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
            if(!estadoEquipo){
                return res.send('No existe estado');
            }

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({ messages: errors.array() });
            }

            estadoEquipo.nombre = req.body.nombre;
            estadoEquipo.estado = req.body.estado;
            estadoEquipo.fechaActualizacion = new Date();

            estadoEquipo = await estadoEquipo.save();

            res.send(estadoEquipo);

        } catch (error) {
            console.log(error);
            res.send('Ocurrio un error');
        }
    }
);

router.get('/:estadoEquipoId', [ validarJWT, validarRolAdmin ], async function(req, res){
    try{

        const estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        if(!estadoEquipo){
            return res.status(404).send('Estado de equipo no existe');
        }

        res.send(estadoEquipo);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al consultar el estado de equipo');
    }
});

module.exports = router;