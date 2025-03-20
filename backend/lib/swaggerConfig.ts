import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        },
    },
    apis: ["dist/lib/swaggerDocs.js"], // Adjust path if needed
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;