import React from 'react'
import { Page, Form, FormLayout, Checkbox } from '@shopify/polaris';



const Login = props => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = React.useCallback(_event => {
        setEmail('');
        setPassword('')
    }, []);
    const handleEmailChange = React.useCallback(value => setEmail(value), []);
    const handlePasswordChange = React.useCallback(value => setPassword(value), []);
    return (

        <Page>
            <Form onSubmit={handleSubmit} autoComplete={true}>
                <FormLayout>
                    {/* <Checkbox label="Sign up for the Polaris newsletter" checked={newsletter} onChange={handleNewsLetterChange} /> */}

                    <TextField value={email} onChange={handleEmailChange} label="Email" type="email" helpText={<span>
                        We’ll use this email address to inform you on future changes to
                        Polaris.
            </span>} />
                    <TextField value={password} onChange={handlePasswordChange} label="Password" type="password" helpText={<span>
                        We’ll use this email address to inform you on future changes to
                        Polaris.
            </span>} />

                    <Button submit>Submit</Button>
                </FormLayout>
            </Form>;
        </Page>
    );
}



export default Login;