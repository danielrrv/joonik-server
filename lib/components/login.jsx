import React from 'react'
import { Page, InlineError, Spinner, Layout, Card, Form, FormLayout, Button, Checkbox, TextField } from '@shopify/polaris';
import { EMAIL, PASSWORD } from '../../config/index'
import e from 'express';



const Login = ({ login }) => {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false)
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [AuthError, setAuthError] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.length < 4 || email.indexOf('@') === -1) {
            setEmailError(true)
            return;
        }
        if (password.length < 4) {
            setPasswordError(true)
            return;
        }
        handleAuth();
    }
    const handleAuth = React.useCallback(() => {
        setLoading(true)
        if (password !== PASSWORD || email !== EMAIL) {
            setAuthError(true);
            return;
        }
        setTimeout(() => {
            setEmail('');
            setPassword('')
            setLoading(false);
            return login(!AuthError)
        }, Math.floor(Math.random() * 5000))

    }, [AuthError, password, email, login])

    const clearError = () => { setEmailError(false); setPasswordError(false); setAuthError(false) };
    const handleEmailChange = React.useCallback(value => { clearError(); setEmail(value) }, []);
    const handlePasswordChange = React.useCallback(value => { clearError(); setPassword(value) }, []);

    return (

        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="Bienvenido a JoonikShop" sectioned>
                        <Form onSubmit={handleSubmit} autoComplete={true}>
                            <FormLayout>
                                <TextField type="email" label="Email address" value={email} onChange={handleEmailChange} />
                                {emailError && <InlineError message="Email is required and should have @ " fieldID="myFieldID" />}
                                <TextField type="password" label="Password" value={password} onChange={handlePasswordChange} />
                                {passwordError && <InlineError message="password is required or more than 4 characters" fieldID="myFieldID" />}
                                <Button submit>Login</Button>
                                {AuthError && <InlineError message={'Email or password incorrect'} fieldID="myFieldID" />}
                                {loading && <Spinner accessibilityLabel="Spinner example" size="large" color="teal" />}
                            </FormLayout>
                        </Form>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}



export default Login;