import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from '@apollo/react-components';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import { CURRENT_USER_QUERY, useUser } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

function TakeMyMoney({ children }) {
  const onToken = async (response, createOrder) => {
    NProgress.start();
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: response.id,
      },
    }).catch((error) => {
      alert(error.message);
    });
    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id },
    });
  };

  const me = useUser();

  return (
    <Mutation
      mutation={CREATE_ORDER_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(createOrder) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          name="Sick Fits"
          description={`Order of ${totalItems(me.cart)} items!`}
          image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
          stripeKey="pk_test_U14ioBw6xxpeuipRvQlXBrTM00WMliJkBf"
          currency="USD"
          email={me.email}
          token={(response) => onToken(response, createOrder)}
        >
          {children}
        </StripeCheckout>
      )}
    </Mutation>
  );
}

export default TakeMyMoney;
export { CREATE_ORDER_MUTATION };
