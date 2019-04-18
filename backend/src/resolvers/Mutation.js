const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in

    const item = await context.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info,
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
      info,
    );
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await context.db.query.item({ where }, `{ id, title }`);
    // 2 . check if they own that item, or have the permissions
    // TODO
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
      info,
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
  async signin(parent, { email, password }, context, info) {
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
  signout(parent, args, context, info) {
    context.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
};

module.exports = Mutations;
