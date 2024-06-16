const express = require('express');
const { getConnection } = require('./db/db-connect-mongo.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
//const host = '0.0.0.0';
const port = process.env.PORT;

getConnection();

//Implementamos corse
app.use(cors());

//Parseo  JSON
app.use(express.json());

app.use('/auth', require('./router/auth'));
app.use('/usuario', require('./router/usuario'));
app.use('/estado-equipo', require('./router/estadoEquipo'));
app.use('/marca', require('./router/marca'));
app.use('/tipo-equipo', require('./router/tipoEquipo.js'));
app.use('/inventario', require('./router/inventario.js'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});