import App from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';
import { CartStateProvider } from '../components/LocalState';

class MyApp extends App {
  static getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;

    return { pageProps };
  };
  render = () => {
    const { Component, apollo, pageProps } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <CartStateProvider value={{ cartOpen: true }}>
          <Page>
            <Component {...pageProps}/>
          </Page>
        </CartStateProvider>
      </ApolloProvider>
    );
  }
};

export default withData(MyApp);
