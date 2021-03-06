import { gql } from "@apollo/client";

export const CategoryListQuery = gql`
  {
    categories {
      name
    }
  }
`;

export const CurrencyListQuery = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

export const ProductListQuery = (categoryTitle) => gql`
  {
    category(input: { title: "${categoryTitle}"}) {
      products {
        id
        name
        inStock
        category
        prices {
          currency {
            symbol
          }
          amount
        }
        brand
        gallery
      }
    }
  }
`;

export const ProductDetailsQuery = (id) => gql`
  {
    product(id: "${id}") {
      id
      name
      inStock
      gallery
      description
      category
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      attributes {
        id
        name
        type
        items {
          id
          value
          displayValue
        }
      }
    }
  }
`;
