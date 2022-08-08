import IO from 'socket.io';

import isAuthenticated from '../../../middlewares/auth';
const io = new IO();
io.origins(['*:*']);

// Authenticate token
io.use((socket, next) => {
  const req = socket.request;
  const { res } = req;
  // Workaround
  req.headers.authorization = socket.handshake.query.token;
  isAuthenticated(req, res, err => {
    if (err) {
      return next(new Error('Unauthorized Connection'));
    }
    next();
  });
});

io.on('connection', socket => {
  const req = socket.request;
  const { user } = req.decodedToken;
  socket.join(user._id, err => {
    if (err) {
      socket.disconnect(true);
    }
  });
  socket.on('createdData', data => {
    socket.broadcast.emit('createdData', data);
  });
  socket.on('updatedData', data => {
    socket.broadcast.emit('updatedData', data);
  });
  socket.on('deletedData', data => {
    socket.broadcast.emit('deletedData', data);
  });
  socket.on('notification', data => {
    socket.to(data.receiverId).emit('notification', data);
  });
  socket.on('leave', room => {
    socket.leave(room);
  });
});

export = io;


