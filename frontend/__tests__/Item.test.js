import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import ItemComponent from '../components/Item';
import { fakeItem } from '../lib/testUtils';

const item = fakeItem();

describe('<Item/>', () => {
  it('renders and matches the snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <ItemComponent item={item} />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it.skip('renders the image properly', () => {
    render(
      <MockedProvider>
        <ItemComponent item={item} />
      </MockedProvider>
    );
    const img = screen.getByAltText(item.name);
    expect(img).toBeInTheDocument();
  });

  it.skip('renders the pricetag and title', () => {
    const { container } = render(
      <MockedProvider>
        <ItemComponent item={item} />
      </MockedProvider>
    );
    expect(screen.getByText('$50')).toBeInTheDocument();
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/item?id=abc123');
    expect(link).toHaveTextContent(item.name);
  });

  it('renders out the buttons properly', () => {
    render(
      <MockedProvider>
        <ItemComponent item={item} />
      </MockedProvider>
    );

    const edit = screen.getByText(/Edit/i);
    expect(edit.href).toContain('update?id=abc123');

    const addToCart = screen.getByText(/add to cart/i);
    expect(addToCart).toHaveProperty('type', 'button');
    expect(addToCart).toBeInTheDocument();

    const deleteItem = screen.getByText(/delete/i);
    expect(deleteItem).toHaveProperty('type', 'button');
    expect(deleteItem).toBeInTheDocument();
  });
});
