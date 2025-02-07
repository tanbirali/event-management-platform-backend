const express = require("express");
const cors = require("cors");
const http = require("http");

const { db, webSocket } = require("./config");

const { authRoutes, eventRoutes } = require("./route");

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

//Websocket Setup
webSocket.setupWebsocket(server);

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
db()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`error: ${error.message}`);
  });
