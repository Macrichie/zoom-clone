const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app); // running server with node and express
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const io = require("socket.io")(server);
const uidGen = require("./uid");

// set port to read env if provided or default to 3030
const port = process.env.PORT || 3030;

// set view engine
app.set("view engine", "ejs");

// add middleware
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uidGen()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// listening to connection from client on server
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    // listen to messages from user
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

// initiate server
server.listen(port, () => console.log(`server listening on port ${port}`));
