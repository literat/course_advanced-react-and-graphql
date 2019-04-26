const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, context, info) {
    // check if there is a current user ID
    if (!context.request.userId) {
      return null;
    }

    return context.db.query.user(
      {
        where: {
          id: context.request.userId,
        },
      },
      info,
    );
  },
  async users(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error('You must be logged in!');
    }
    // 2. Check if the user has permissions to query all users
    hasPermission(context.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 3. if they do, query all the users
    return context.db.query.users({}, info);
  },
};

module.exports = Query;
