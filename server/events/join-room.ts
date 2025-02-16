const JoinRoom = (socket: any) => {
  socket.on("joinRoom", () => {
    console.info(`Socket ${socket.id} joined`);
  });
};

export { JoinRoom };
