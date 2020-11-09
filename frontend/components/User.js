import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      orders {
        id
      }
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;

function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  if (data) {
    return data.me;
  }
}

export { CURRENT_USER_QUERY, useUser };
