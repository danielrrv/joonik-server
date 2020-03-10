import React from 'react';
import ResourceListWithProducts from '../components/ResourceList';


import {
    Card,
    TextContainer,
    PageActions,
    Page,

    DisplayText,
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
        return <Loader />;
    }
    return (
        <Page>
            <PageActions
                primaryAction={[{
                    content: 'Create product',
                    onAction: () => { window.location.href = 'edit-product' }
                }]}
                secondaryActions={[{
                    content: "Logout",
                    onAction: () => { window.localStorage.removeItem('uuid'); window.location.href = '/' }
                }]}
            />
            <DisplayText size="extraLarge">Welcome to JoonikShop.</DisplayText>
            <Card title="Online store dashboard" sectioned>
                <p>View a summary of your online store’s performance.</p>
            </Card>
            <ResourceListWithProducts />
        </Page>
    )
}

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';



const Loader = () => {
    return (<>
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
        </Card>
    </>
    );
};








export default Home;