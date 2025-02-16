const LeaveRoom = (socket: any) => {
  socket.on("leaveRoom", () => {
    console.info(`Socket ${socket.id} Leave`);
  });
};

export { LeaveRoom };
