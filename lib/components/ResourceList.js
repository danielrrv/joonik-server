import gql from 'graphql-tag';
import React from 'react'
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
  ResourceItem
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const GET_PRODUCTS = gql`
{
  products( first:10)	{
          edges	{
              node	{
                    title
                    handle
                    descriptionHtml
                    id
                    images(first: 1) {
                      edges {
                        node {
                            originalSrc
                            altText
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          price
                            id
                        }
                    }
              }
          }
      }
}
}

`;

class ResourceListWithProducts extends React.Component {
  // static contextType = Context;
  render() {
    // const app = this.context;
    // const redirectToProduct = () => {
    //   const redirect = Redirect.create(app);
    //   redirect.dispatch(
    //     Redirect.Action.APP,
    //     '/edit-product',
    //   );
    // };

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
    return (
      <Query query={GET_PRODUCTS} >
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) {
            console.log(error);
            return <div>{error.message}</div>;
          }

          const { products } = data
          console.log(products)
          console.log(products.edges.length)
          return (
            // <Card>
            //   {products.edges.map((item, index)=>{
            //     console.log(item.node)
            //     return <div key={index}>{item.node.title}</div>;
            //   })}
            //   </Card>
            <Card>
              <ResourceList
                // resourceName={{ singular: 'Product', plural: 'Products' }}
                ItemsCount={10}
                items={products.edges}
                renderItem={(product) => {
                  const item  = product.node;
                  // console.log(item)
                  const media = (
                    <Thumbnail
                      source={
                        item.images.edges[0]
                          ? item.images.edges[0].node.originalSrc
                          : ''
                      }
                      alt={
                        item.images.edges[0]
                          ? item.images.edges[0].node.altText
                          : ''
                      }
                    />
                  );
                  const price = item.variants.edges[0].node.price;
                  return (
                    <ResourceItem
                      id={item.id}
                      media={media}
                      accessibilityLabel={`View details for ${item.title}`}
                      onClick={() => {
                        store.set('item', item);
                        redirectToProduct();
                      }
                      }
                    >
                      <Stack>
                        <Stack.Item fill> 
                          <h3>
                            <TextStyle variation="strong">
                              {item.title}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                          <p>${price}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>Expires on {twoWeeksFromNow} </p>
                        </Stack.Item>
                      </Stack>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          );
        }}
      </Query>
    );
  }
}

export default ResourceListWithProducts;
