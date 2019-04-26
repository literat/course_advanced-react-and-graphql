const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// decode JWT so we can get the user Id on each request
server.express.use((request, response, next) => {
  const { token } = request.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto request for future requests to access
    request.userId = userId;
  }
  next();
});

// 2. Create a middleware that populates the user on each request
server.express.use(async (request, response, next) => {
  // if they are not logged in, skip this
  if (!request.userId) return next();

  const user = await db.query.user(
    {
      where: {
        id: request.userId,
      },
    },
    '{id, permissions, email, name}',
  );

  request.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`);
  },
);
