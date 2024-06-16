const mongoose = require('mongoose');

const getConnection = async () => {
    try{
        const url = 'mongodb://admin:kxJfkbC81LWQWKZE@ac-bue0b5g-shard-00-00.j0ec5ko.mongodb.net:27017,ac-bue0b5g-shard-00-01.j0ec5ko.mongodb.net:27017,ac-bue0b5g-shard-00-02.j0ec5ko.mongodb.net:27017/app-inventarios?ssl=true&replicaSet=atlas-e1jea2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

        await mongoose.connect(url);
        console.log('Conexión exitosa');
    }catch(error){
        console.log(error);
    }
}

module.exports = { getConnection, }