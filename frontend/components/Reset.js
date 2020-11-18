import React from 'react'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      message
    }
  }
`;

function Reset({ resetToken }) {
  const { inputs, handleChange, resetForm } = useForm({
    password: '',
    confirmPassword: '',
  });
  const [resetPassword, { error, loading, data }] = useMutation(
    RESET_MUTATION,
    {
      variables: {
        resetToken,
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  console.log(data);

  return (
    <Form
      method="post"
      onSubmit={async (event) => {
        event.preventDefault();
        await resetPassword();
        resetForm();
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Reset Your Password</h2>
        {data && data.resetPassword && data.resetPassword.message}
        <Error error={error} />
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Your Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirmPassword"
            value={inputs.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset Your Password</button>
      </fieldset>
    </Form>
  );
}

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired,
};

export default Reset;
