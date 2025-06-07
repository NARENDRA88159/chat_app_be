const swaggerJsdoc = require("swagger-jsdoc");

const swaggerAutogen = require('swagger-autogen')();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "chat  APIs",
      version: "1.0.0",
      description: "API documentation for my chat project",
    },
    host: "localhost:5000",
    servers: [{ url: "http://localhost:5000" }], // URL of your server

  },
  info: {
    title: "chat APIs",
    version: "1.0.0",
    description: "API documentation for my chat project",
},
host: "localhost:5000", // Correct host and port
schemes: ["http"], // Use 'https' if deployed securely


  apis: ["./swagger/*.js"], // This is where your API routes are documented
};

const outputFile = '../swagger-output.json';

const routes = ['server.js']

swaggerAutogen(outputFile,routes,swaggerOptions)
const swaggerDocs = swaggerJsdoc(swaggerOptions);
// swaggerAutogen(outputFile,routes,swaggerOptions)
module.exports = swaggerDocs;
