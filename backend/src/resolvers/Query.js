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
      info
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
  async order(parent, args, context, info) {
    // 1. Make sure they are logged in
    if (!context.request.userId) {
      throw new Error("You aren't logged in");
    }
    // 2. Query current order
    const order = await context.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );
    // 3. Check if they have the permission to see this order
    const ownsOrder = order.user.id === context.request.userId;
    const hasPermissionToSeeOrder = context.request.user.permissions.includes(
      'ADMIN'
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You can't see this budddd");
    }
    // 4. Return the order
    return order;
  },
  async orders(parent, args, context, info) {
    const { userId } = context.request;
    if (!context.request.userId) {
      throw new Error("You aren't logged in");
    }
    return context.db.query.orders(
      {
        where: {
          user: {
            id: userId,
          },
        },
      },
      info
    );
  },
};

module.exports = Query;
