import { ApolloServer } from 'apollo-server-micro';
import nextConnect from 'next-connect';
import dotenv from 'dotenv';
import { resolvers } from '../../lib/graphql/resolvers';
import { typeDefs } from '../../lib/graphql/schemas/index';
import db from '../../lib/db';
import useUserId from '../../lib/middleware/useUserId';
import useUser from '../../lib/middleware/useUser';
import useCookie from '../../lib/middleware/useCookie';

dotenv.config({ path: '.env.local' });

const context = (request) => ({ ...request, db });

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});
const useApollo = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

handler.use(useCookie());
handler.use(useUserId());
handler.use(useUser());
handler.use(useApollo);

export default handler;
