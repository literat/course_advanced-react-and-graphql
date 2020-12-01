import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { transport, makeANiceEmail } from '../../../mail';
import { hasPermission } from '../../../utils';
import stripe from '../../../stripe';

export const Mutation = {
  async createItem(parent, args, context, info) {
    if (!context.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const item = await context.db.mutation.createItem(
      {
        data: {
          // This is how to create a relationship between the Item and the User
          user: {
            connect: {
              id: context.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );

    return item;
  },
  updateItem(parent, args, context, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove ID from updates
    delete updates.id;

    // run the update method
    return context.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await context.db.query.item(
      { where },
      `{ id title user { id } }`
    );
    // 2 . check if they own that item, or have the permissions
    const ownsItem = item.user.id === context.request.userId;
    const hasPermissions = context.request.user.permissions.some((permission) =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    );

    if (!ownsItem && !hasPermissions) {
      throw new Error("You don't have permission to do that!");
    }

    // 3. Delete it!
    return context.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, context, info) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // has their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = context.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // create JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set jwt as a cookie on the response
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // Finallllly we return the user to the browser
    return user;
  },
  async signin(parent, { email, password }, context) {
    // 1. Check if there is a user with that email
    const user = await context.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    // 3. Generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // 5. Return the user
    return user;
  },
  signout(parent, args, context) {
    context.response.clearCookie('token');

    return { message: 'Goodbye!' };
  },
  async requestReset(parent, args, context) {
    // 1. Check if this is a real user
    const user = await context.db.query.user({ where: { email: args.email } });

    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await context.db.mutation.updateUser({
      where: { email: args.email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 3. Email them that reset token
    await transport.sendMail({
      from: 'wes@wesbos.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(
        `Your Password Reset Token is here! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here To Reset</a>`
      ),
    });

    // 4. Return the message
    return { message: 'Thanks!' };
  },
  async resetPassword(parent, args, context) {
    // 1. Check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords don't match!");
    }
    // 2. Check if its a legit reset token
    // 3. Check if its expired
    const [user] = await context.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now - 3600000,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await context.db.mutation.updateUser({
      where: {
        email: user.email,
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    // 8. return the message
    return { message: 'Your password has been reset!' };
  },
  async updateUser(parent, args) {
    console.log(args.name);
  },
  async updatePermissions(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error('You must be logged in!');
    }
    // 2. Query the current user
    const currentUser = await context.db.query.user(
      {
        where: {
          id: context.request.userId,
        },
      },
      info
    );
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    // 4. Update the permissions
    return context.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
  async addToCart(parent, args, context, info) {
    // 1. Make sure they are signed in
    const { userId } = context.request;
    if (!userId) {
      throw new Error('You must be signed in soooon!');
    }
    // 2. Query the users current cart
    const [existingCartItem] = await context.db.query.cartItems({
      where: {
        user: {
          id: userId,
        },
        item: { id: args.id },
      },
    });
    // 3. Check if that item is already in their cart and increment by 1 if it is
    if (existingCartItem) {
      console.log('This item is already in their cart');

      return context.db.mutation.updateCartItem(
        {
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + 1,
          },
        },
        info
      );
    }

    // 4. If it is not, create a fresh CartItem for that user!
    return context.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          item: {
            connect: {
              id: args.id,
            },
          },
        },
      },
      info
    );
  },
  async removeFromCart(parent, args, context, info) {
    // 1. Find the cart item
    const cartItem = await context.db.query.cartItem(
      { where: { id: args.id } },
      `{ id, user { id } }`
    );
    // 1.5 Make sure we found the item
    if (!cartItem) throw new Error('No Cart Item Found! ');
    // 2 Make sure they own the cart item
    if (cartItem.user.id !== context.request.userId) {
      throw new Error('Cheatin huhhhh');
    }

    // 3. Delete the cart item
    return context.db.mutation.deleteCartItem(
      {
        where: { id: args.id },
      },
      info
    );
  },
  async createOrder(parent, args, context) {
    // 1. Query the current user and make sure they are signed in
    const { userId } = context.request;
    if (!userId)
      throw new Error('You must be signed in to complete this order.');
    const user = await context.db.query.user(
      { where: { id: userId } },
      `
        {
          id
          name
          email
          cart {
            id
            quantity
            item {
              title
              price
              id
              description
              image
              largeImage
            }
          }
        }
      `
    );
    // 2. Recalculate the total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    );
    console.log(`Going to charge for a total of ${amount}`);
    // 3. Create the Stripe charge (turn token into $$$)
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token,
    });
    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map((cartItem) => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      };
      delete orderItem.id;

      return orderItem;
    });
    // 5. Create the Order
    const order = await context.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } },
      },
    });
    // 6. Clean up - clear users cart, delete cartItems
    const cartItemIds = user.cart.map((cartItem) => cartItem.id);
    await context.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      },
    });

    // 7. Return the Order to the client
    return order;
  },
};
