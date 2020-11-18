/* eslint-disable react/jsx-props-no-spreading */
import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { endpoint, prodEndpoint } from '../config';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: (operation) => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
  });
}

function renderPage({ Page, props }) {
  const { apollo, ...rest } = props;

  return (
    <ApolloProvider client={apollo}>
      <Page {...rest} />
    </ApolloProvider>
  );
}

export default withApollo(createClient, { render: renderPage });
