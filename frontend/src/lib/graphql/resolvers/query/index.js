import {
  makeOrderByPrisma2Compatible,
  makeWherePrisma2Compatible,
} from '@prisma/binding-argument-transform';
import { hasPermission } from '../../../utils';

// export const Query = {
//   applications: applicationsQuery,
// };

// import { forwardTo } from 'prisma-binding';

export const Query = {
  items(parent, args, context) {
    const { where, orderBy, skip, first, last, after, before } = args;
    const prisma2Where = makeWherePrisma2Compatible(where);
    const prisma2OrderBy = makeOrderByPrisma2Compatible(orderBy);
    const skipValue = skip || 0;
    const prisma2Skip = before ? skipValue + 1 : skipValue;
    const prisma2Take = last ? -last : first;
    const prisma2Before = { id: before };
    const prisma2After = { id: after };
    const prisma2Cursor =
      !before && !after ? undefined : before ? prisma2Before : prisma2After;

    return context.db.item.findMany({
      where: prisma2Where,
      orderBy: prisma2OrderBy,
      skip: prisma2Skip,
      cursor: prisma2Cursor,
      take: prisma2Take,
    });
  },
  // item: forwardTo('db'),
  async itemsConnection(parent, args, context) {
    const { where, orderBy, skip, first, last, after, before } = args;
    const prisma2Where = makeWherePrisma2Compatible(where);
    const prisma2OrderBy = makeOrderByPrisma2Compatible(orderBy);
    const skipValue = skip || 0;
    const prisma2Skip = before ? skipValue + 1 : skipValue;
    const prisma2Take = last ? -last : first;
    const prisma2Before = { id: before };
    const prisma2After = { id: after };
    const prisma2Cursor =
      !before && !after ? undefined : before ? prisma2Before : prisma2After;

    const items = await context.db.item.findMany({
      where: prisma2Where,
      orderBy: prisma2OrderBy,
      skip: prisma2Skip,
      cursor: prisma2Cursor,
      take: prisma2Take,
    });

    return {
      edges: items.map((singleData) => ({ node: singleData })) || [],
      aggregate: {
        count: await context.db.item.count({ where: prisma2Where }),
      },
    };
  },
  me(parent, args, context, info) {
    // check if there is a current user ID
    if (!context.req.userId) {
      return null;
    }

    return context.db.user.findUnique(
      {
        where: {
          id: context.req.userId,
        },
      },
      info
    );
  },
  async users(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.req.userId) {
      throw new Error('You must be logged in!');
    }
    // 2. Check if the user has permissions to query all users
    hasPermission(context.req.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 3. if they do, query all the users
    return context.db.user.findMany({}, info);
  },
  // async order(parent, args, context, info) {
  //   // 1. Make sure they are logged in
  //   if (!context.request.userId) {
  //     throw new Error("You aren't logged in");
  //   }
  //   // 2. Query current order
  //   const order = await context.db.order(
  //     {
  //       where: { id: args.id },
  //     },
  //     info
  //   );
  //   // 3. Check if they have the permission to see this order
  //   const ownsOrder = order.user.id === context.request.userId;
  //   const hasPermissionToSeeOrder = context.request.user.permissions.includes(
  //     'ADMIN'
  //   );
  //   if (!ownsOrder || !hasPermissionToSeeOrder) {
  //     throw new Error("You can't see this budddd");
  //   }

  //   // 4. Return the order
  //   return order;
  // },
  // async orders(parent, args, context, info) {
  //   const { userId } = context.request;
  //   if (!context.request.userId) {
  //     throw new Error("You aren't logged in");
  //   }

  //   return context.db.query.orders(
  //     {
  //       where: {
  //         user: {
  //           id: userId,
  //         },
  //       },
  //     },
  //     info
  //   );
  // },
};
