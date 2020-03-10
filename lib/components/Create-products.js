import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
} from '@shopify/polaris';
import store from 'store-js';
import React from 'react'

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const UPDATE_PRICE = gql`
mutation productCreate($input:ProductInput!) {
  productCreate(input:$input) {
    userErrors {
      field
      message
    }
    product {
      
      title
      descriptionHtml

      variants(first:1) {
        edges {
          node {
          
            price
          }
        }
      }
    }
  }
}
`;

class EditProduct extends React.Component {
  state = {
    price: '',
    descriptionHtml: '',
    title: '',
    id: Math.floor(Math.random() * 1000),
    showToast: false,
  };


  render() {
    const { title, descriptionHtml, price, id } = this.state;
    return (
      <Mutation
        mutation={UPDATE_PRICE}
      >
        {(handleSubmit, { error, data }) => {

          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          const showToast = data && (
            <Toast
              content="Sucessfully updated"
              onDismiss={() => this.setState({ showToast: false })}
            />
          );
          return (
            <Frame>
              <Page>
                <Layout>
                  {showToast}
                  <Layout.Section>
                    {showError}
                  </Layout.Section>
                  <Layout.Section>
                    <DisplayText size="large">{title}</DisplayText>
                    <Form>
                      <Card sectioned>
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              value={title}
                              onChange={this.handleChange('title')}
                              label="Title"
                              type="title"
                            />
                            <TextField
                              value={descriptionHtml}
                              onChange={this.handleChange('descriptionHtml')}
                              label="Description"
                              type="descriptionHtml"
                            />
                            <TextField
                              prefix="$"
                              value={price}
                              onChange={this.handleChange('price')}
                              label="Original price"
                              type="price"
                            />


                          </FormLayout.Group>
                          <p>
                            This sale price will expire in two weeks
                          </p>
                        </FormLayout>
                      </Card>
                      <PageActions
                        primaryAction={[
                          {
                            content: 'Save',
                            onAction: () => {
                              const productVariableInput = {
                                variants: [{
                                  price
                                }],
                                title: title,
                                descriptionHtml: descriptionHtml
                              };
                              handleSubmit({
                                variables: { input: productVariableInput },
                              });
                            },
                          },
                        ]}
                        secondaryActions={[
                          {
                            content: 'Volver',
                            destructive: true,
                            onAction: () => window.location.href = '/'
                          },
                        ]}
                      />
                    </Form>
                  </Layout.Section>
                </Layout>
              </Page>
            </Frame>
          );
        }}
      </Mutation>
    );
  }

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };


}

export default EditProduct;