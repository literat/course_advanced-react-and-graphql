import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      # orders {
      #   id
      # }
      # cart {
      #   id
      #   quantity
      #   item {
      #     id
      #     price
      #     image
      #     title
      #     description
      #   }
      # }
    }
  }
`;

function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  if (data) {
    return data.me;
  }
}

export { CURRENT_USER_QUERY, useUser };
