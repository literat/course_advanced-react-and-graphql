import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

function AutoComplete() {
  const router = useRouter();
  const [findItems, { loading, data }] = useLazyQuery(SEARCH_ITEMS_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const items = data ? data.items : [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();

  return (
    <SearchStyles>
      <Downshift
        onChange={(item) =>
          router.push({
            pathname: '/item',
            query: {
              id: item.id,
            },
          })
        }
        itemToString={(item) => (item === null ? '' : item.title)}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <input
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getInputProps({
                type: 'search',
                placeholder: 'Search For An Item',
                id: 'search',
                className: loading ? 'loading' : '',
                onChange: (e) => {
                  e.persist();
                  if (!e.target.value) return; // if it's empty, don't search
                  findItemsButChill({
                    variables: { searchTerm: e.target.value },
                  });
                },
              })}
            />

            {isOpen && inputValue && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem> Nothing Found {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
}

export default AutoComplete;
