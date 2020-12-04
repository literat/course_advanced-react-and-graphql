import { cookie } from '../utils';

/**
 * Adds `cookie` function on `response.cookie` to set cookies for response
 */
const cookieMiddleware = () => (request, response, next) => {
  response.cookie = (name, value, options) =>
    cookie(response, name, value, options);

  response.clearCookie = (name) => cookie(response, name, '', { maxAge: -1 });

  next();
};

export default cookieMiddleware;
