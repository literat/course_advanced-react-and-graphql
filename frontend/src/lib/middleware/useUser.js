import db from '../db';

// 2. Create a middleware that populates the user on each request
const userMiddleware = () => async (request, response, next) => {
  // if they are not logged in, skip this
  if (!request.userId) {
    next();
  }

  console.log(request.userId);

  const user = await db.user.findUnique(
    {
      where: {
        id: request.userId,
      },
    }
    // '{id, permissions, email, name}'
  );

  console.log({ user });

  request.user = user;

  next();
};

export default userMiddleware;
