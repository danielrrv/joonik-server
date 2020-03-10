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
    //efect to regenerate a skeleto longer.
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


//loader!/
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