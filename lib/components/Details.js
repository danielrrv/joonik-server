import React, { useState, useCallback } from 'react'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { TextContainer, Modal, Thumbnail, DisplayText, Stack, TextStyle } from '@shopify/polaris'




const GET_PRODUCT = gql`
  query getProducts($id:ID!) {
    product(id: $id) {
   
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
`;


function ModalDetail({ open, setClose, productId }) {
    const [id, setId] = useState(productId)
    const [active, setActive] = useState(false);

    const handleChange = useCallback(() => setActive(!active), [active]);
    const handleClose = useCallback(() => { setClose(); handleChange() })

    React.useEffect(() => {
        if (open) {
            handleChange()
        }
        return () => setActive(false);
    }, [open]);



    React.useEffect(() => {
        setId(productId)
    }, [productId]);


    const { loading, error, data } = useQuery(GET_PRODUCT, {
        variables: { id: id },
    });
    // if (loading) return <p>Loading ...</p>;
    // if (error) return <p>Error!</p>
    if (data) {
        console.log(data.product)
    }

    return (
        <div >
            {/* <Button onClick={handleChange}>Open</Button> */}
            <div></div>
            {data && <Modal
                open={active}
                title={data && data.product.title}
                onClose={handleClose}

            >
                <Modal.Section >
                    <Thumbnail
                        source={data.product.images.edges[0].node.originalSrc}
                        size="large"
                        alt={data.product.images.edges[0].node.altText}
                    />
                    <TextContainer>
                        <Stack>
                            <Stack.Item vertical>
                                <h3>
                                    <TextStyle variation="strong">
                                        {data.product.title}
                                    </TextStyle>
                                </h3>
                            </Stack.Item>
                            <Stack.Item >
                                <DisplayText size="medium">Price</DisplayText>
                                <DisplayText size="medium">{data.product.variants.edges[0].node.price}</DisplayText>

                            </Stack.Item>
                        </Stack>

                    </TextContainer>
                </Modal.Section>

            </Modal>
            }
        </div>
    );
}


export default ModalDetail;