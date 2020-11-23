import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Router from 'next/router';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';

Router.router = {
  push() {},
  prefetch() {},
};

function makeMocksFor(length) {
  return [
    {
      request: {
        query: PAGINATION_QUERY,
      },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              __typename: 'count',
              count: length,
            },
          },
        },
      },
    },
  ];
}

describe('<Pagination/>', () => {
  it('displays a loading message', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    expect(queryByText('Loading...')).toBeTruthy();
  });

  it.skip('renders pagination for 18 items', async () => {
    const { container, findByTestId, getByTestId } = render(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    // wait for pagination to get past loading
    await findByTestId('pagination');
    expect(getByTestId('totalPages')).toHaveTextContent('5');
    expect(container).toMatchSnapshot();
  });

  it.skip('disables prev button on first page', async () => {
    const { getByText, findByTestId } = render(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await findByTestId('pagination');
    expect(getByText(/Prev/)).toHaveAttribute('aria-disabled', 'true');
    expect(getByText(/Next/)).toHaveAttribute('aria-disabled', 'false');
  });

  it.skip('disables next button on last page', async () => {
    const { getByText, findByTestId } = render(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    );
    await findByTestId('pagination');
    expect(getByText(/Prev/)).toHaveAttribute('aria-disabled', 'false');
    expect(getByText(/Next/)).toHaveAttribute('aria-disabled', 'true');
  });

  it.skip('enables all buttons on a middle page', async () => {
    const { getByText, findByTestId } = render(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await findByTestId('pagination');
    expect(getByText(/Prev/)).toHaveAttribute('aria-disabled', 'false');
    expect(getByText(/Next/)).toHaveAttribute('aria-disabled', 'false');
  });
});
