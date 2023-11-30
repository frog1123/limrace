const express = require("express");
const http = require("http");
const setupSocketIO = require("./sockets");
const routes = require("./routes");

const port = process.env.PORT ?? 3000;
const app = express();
const server = http.createServer(app);

// express
app.use("/", routes);

// socket
setupSocketIO(server, port);

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
