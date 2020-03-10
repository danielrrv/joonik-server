import gql from 'graphql-tag';
import React, { useCallback } from 'react'
import { Query } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
  ResourceItem
} from '@shopify/polaris';
import store from 'store-js';
import Details from '../components/Details';


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

const ResourceListWithProducts = () => {

  const [open, setOpen] = React.useState(false);
  const [productId, setProductId] = React.useState();
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open, setOpen])

  const handleId = useCallback((id) => {
    setProductId(id)
  }, [setProductId])

  const { loading, error, data } = useQuery(GET_PRODUCTS)
  if (loading) return <p>loading...</p>;
  if (error) return <p>{error.message}</p>;

  const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
  const { products } = data
  return (
    <Card>
      <ResourceList
        // resourceName={{ singular: 'Product', plural: 'Products' }}
        ItemsCount={10}
        items={products.edges}
        renderItem={(product) => {
          const item = product.node;
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
                handleId(item.id)
                setOpen(true);
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
                <Stack.Item>

                </Stack.Item>
              </Stack>
            </ResourceItem>

          );
        }}
      />
      <Details setClose={handleClose} open={open} productId={productId} />
    </Card>
  );



}

export default ResourceListWithProducts;
