import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_ITEMS_QUERY } from './Items';
import { PAGINATION_QUERY } from './Pagination';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

function CreateItem() {
  const { inputs, handleChange } = useForm({
    name: 'Nice Shoes',
    description: 'soo nice',
    image: '',
    price: 500,
  });

  const [createItem, { loading, error }] = useMutation(CREATE_ITEM_MUTATION, {
    variables: inputs,
    // update,
    refetchQueries: [{ query: ALL_ITEMS_QUERY }, { query: PAGINATION_QUERY }],
  });

  const uploadFile = async (event) => {
    const { files } = event.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/literat/image/upload',
      { method: 'POST', body: data }
    );
    const file = await response.json();
    // this.setState({
    // image: file.secure_url,
    // largeImage: file.eager[0].secure_url,
    // });
  };

  return (
    <Form
      data-test="form"
      onSubmit={async (event) => {
        // Stop the form from submitting
        event.preventDefault();
        // call the mutation
        const response = await createItem();
        // change them to single item page
        console.log(response);
        Router.push({
          pathname: '/item',
          query: { id: response.data.createItem.id },
        });
      }}
    >
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input
            type="file"
            id="file"
            name="file"
            placeholder="Upload an image"
            required
            onChange={uploadFile}
          />
          {inputs.image && (
            <img src={inputs.image} width="200" alt="Upload Preview" />
          )}
        </label>
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
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
