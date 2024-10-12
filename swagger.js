const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Cars API',
        description: 'Cars API'
    },
    host: 'localhost:4000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);