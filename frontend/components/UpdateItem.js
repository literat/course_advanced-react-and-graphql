import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

function UpdateItem({ id }) {
  const { data = {}, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });
  const { inputs, handleChange } = useForm(data.item);
  const [updateItem, { loading: updating, error }] = useMutation(
    UPDATE_ITEM_MUTATION,
    {
      variables: {
        id,
        ...inputs,
      },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (!data || !data.item) return <p>No Item Found for ID {id}</p>;

  return (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await updateItem();
      }}
    >
      <Error error={error} />
      <fieldset disabled={updating} aria-busy={updating}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            value={inputs.title}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="text"
            id="price"
            name="price"
            placeholder="Price"
            required
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            type="text"
            id="description"
            name="description"
            placeholder="Enter a Description"
            required
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
      </fieldset>
    </Form>
  );
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequred,
};

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
