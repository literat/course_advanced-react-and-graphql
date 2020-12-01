import jwt from 'jsonwebtoken';

// decode JWT so we can get the user Id on each request
const userIdMiddleware = () => (request, response, next) => {
  const { token } = request.cookies;

  console.log(token);

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto request for future requests to access
    console.log({ userId });
    request.userId = userId;
  }

  // return handler(request, response);
  next();
};

export default userIdMiddleware;
