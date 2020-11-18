import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import { ApolloConsumer } from '@apollo/client';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Router from 'next/router';
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

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

class AutoComplete extends React.Component {
  onChange = debounce(async (event, client) => {
    console.log('Searching...');
    // turn loading on
    this.setState({
      loading: true,
    });
    // Manually query apollo client
    const response = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: event.target.value },
    });
    this.setState({
      items: response.data.items,
      loading: false,
    });
  }, 350);

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
    };
  }

  render() {
    resetIdCounter();

    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
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
              <ApolloConsumer>
                {(client) => (
                  <input
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search For An Item',
                      id: 'search',
                      // eslint-disable-next-line react/destructuring-assignment
                      className: this.state?.loading ? 'loading' : '',
                      onChange: (event) => {
                        event.persist();
                        this.onChange(event, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {/* eslint-disable-next-line react/destructuring-assignment */}
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      key={item.id}
                      highlighted={index === highlightedIndex}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...getItemProps({
                        item,
                      })}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {/* eslint-disable-next-line react/destructuring-assignment */}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>Nothing Found {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
