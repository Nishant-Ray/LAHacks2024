import express from "express";
import { createServer } from "node:http";
import bodyParser from 'body-parser';
import router  from "./routes.js";

// Port that the server API is listening to
const app = express();
const server = createServer(app);

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/", router);

const portNum = 8080;
const hostName = "localhost";

server.listen(portNum, hostName, async () => {
  const { port } = server.address();

  console.log(`Server running at http://${hostName}:${port}`);
});