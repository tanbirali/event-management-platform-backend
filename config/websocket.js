const { Server } = require("socket.io");
let io;
const eventAttendeeMap = new Map();
const setupWebsocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  //Websocket Connection
  io.on("connection", (socket) => {
    console.log("New Connection", socket.id);

    socket.on("joinEvent", (eventId) => {
      socket.join(eventId);
      if (!eventAttendeeMap.has(eventId)) {
        eventAttendeeMap.set(eventId, 0);
      }
      io.to(eventId).emit("attendeeCount", eventAttendeeMap.get(eventId));
    });

    //Cleanup
    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });
};

const updateAttendeeCount = (eventId, count) => {
  eventAttendeeMap.set(eventId, count);
  io.to(eventId).emit("attendeeCount", count);
};
module.exports = { setupWebsocket, updateAttendeeCount };
