import React from 'react';
import ResourceListWithProducts from './ResourceList';
import store from 'store-js';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import {
    EmptyState,
    Card,
    TextContainer,
    PageActions,
    Page,
    Layout,
    SkeletonBodyText,
    SkeletonDisplayText
} from '@shopify/polaris'




const Home = () => {
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, Math.floor(Math.random() * 3000))

    }, []);

    if (loading) {
        return <>
            <Card sectioned>
                <SkeletonDisplayText primaryAction={true} />
            </Card>
            <Card sectioned>
                <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                </TextContainer>
            </Card>
            <Card sectioned>
                <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                </TextContainer>
            </Card></>;

    }
    return (
        <Page>
            <PageActions
                primaryAction={[{
                    content: 'Logout',
                    destructive: true,
                    onAction: () => { window.localStorage.removeItem('uuid'); window.location.href = '/' }
                }]}

            />
            <Card title="Online store dashboard" sectioned>
                <p>View a summary of your online store’s performance.</p>
            </Card>
            <ResourceListWithProducts/>

        </Page>
    )
}

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Select = () => {
    const [open, setOpen] = React.useState(false);

    function handleSelection(resources) {
        const idsFromResources = resources.selection.map((product) => product.id);
        setOpen(false);
        store.set('ids', idsFromResources);
    };
    const emptyState = !store.get('ids');
    return (
        <Page>
            <TitleBar primaryAction={{
                content: 'Select products',
                onAction: () => setOpen(true),
            }} />
            <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={open}
                onSelection={(resources) => handleSelection(resources)}
                onCancel={() => setOpen(false)}
            />
            {emptyState ? (<Layout>
                <EmptyState
                    heading="Discount your products temporarily"
                    action={{
                        content: 'Select products',
                        onAction: () => setOpen(true),
                    }}
                    image={img}
                >
                    <p>Select products to change their price temporarily.</p>
                </EmptyState>
            </Layout>) : (<ResourceListWithProducts />)
            }
        </Page>
    );



}



export default Home;