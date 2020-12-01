import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useUser } from './User';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import PleaseSignIn from './PleaseSignIn';
import FormItem from './FormItem';

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION($name: String!, $id: ID!) {
    updateUser(id: $id, name: $name) {
      id
      name
    }
  }
`;

function Account() {
  const me = useUser();
  const { inputs, handleChange } = useForm({
    name: me.name,
  });

  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    variables: {
      id: me.id,
      name: inputs.name,
    },
  });

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        await updateUser();
      }}
    >
      <fieldset disabled={loading}>
        <FormItem inputs={inputs} onChange={handleChange} name="name" />
        <button type="submit">Updat{loading ? 'ing' : 'e'}</button>
      </fieldset>
    </Form>
  );
}

function Component() {
  return (
    <PleaseSignIn>
      <Account />
    </PleaseSignIn>
  );
}

export default Component;
