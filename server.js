const express = require('express');
const dotenv = require('dotenv');
const cors =require("cors")
dotenv.config();
const connectToDB=require("./db")
connectToDB();
const app = express();
const swaggerUi  = require("swagger-ui-express");
const swaggerDocs = require("./swagger-output.json"); // Import the generated Swagger JSON

const PORT = process.env.PORT || 3000; // default port fallback


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("api/user",UserRoute)




app.listen(PORT, () => {
  console.log(`🚀 Server started on port: ${PORT}`);
});
