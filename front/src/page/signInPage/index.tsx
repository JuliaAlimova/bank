import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../component/authRoute';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { SrcLogo, ActionType, NotificationType, sizeTitle } from '../../contexts/commonProps';

function SignInPage(): React.ReactElement {
    const headerStyle = {
        marginBottom: '32px',
    };

    const navigate = useNavigate();
    const { dispatch, state } = useAuth();
    const token = state.token;

    const [errorAuth, setErrorAuth] = useState(false);
    const [errorAuthMessage, setErrorAuthMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);

    const errorAuthComponent = <Link className='link' to={'/signup-confirm'}>Confirm email</Link>;

    const handleEmailChange = (value: string, isValid: boolean) => {
        setEmail(value);
        setEmailError(!isValid);
        setErrorAuth(false);
        setEmptyFields(false)
    };

    const handlePasswordChange = (value: string, isValid: boolean) => {
        setPassword(value);
        setPasswordError(!isValid);
        setErrorAuth(false);
        setEmptyFields(false)
    };

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (emailError || passwordError) {
            return
        }

        try {
            const res = await fetch("http://localhost:4000/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    token: token,
                    srcLogo: SrcLogo.DANGER,
                    actionType: ActionType.LOGIN,
                    notificationType: NotificationType.LOGIN,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: data.token,
                        user: data.user,
                    }
                });

                localStorage.setItem('authState', JSON.stringify({ data, expirationTime: new Date().getTime() + 60 * 60 * 1000, }));

                setErrorAuthMessage('');
                setErrorAuth(false);
                setEmptyFields(false);
                navigate('/balance');
            } else {
                setErrorAuthMessage(data.message)
                setErrorAuth(true)
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Page backButton={true} headerStyle={headerStyle} text='Sign in' subText='Select login method' size={sizeTitle.STANDARD}>
            <React.Fragment>
                <form className='form' onSubmit={handleSignin}>
                    <Field type={'email'} name={'email'} placeholder='example@gmail.com' label='Email' formType='signIn' onChange={handleEmailChange} value={email} />
                    <Field type={'password'} name={'password'} placeholder={'Enter your password'} label={'Password'} formType='signIn' onChange={handlePasswordChange} value={password} />
                    <div>{'Forgot your password? '}
                        <Link className='link' to={"/recovery"}>Restore</Link>
                    </div>
                    <div className='buttons'>
                        <Button type='submit' textButton={'Continue'} disabled={emailError || passwordError || Boolean(!password) || Boolean(!email)} />
                    </div>
                </form>
                {errorAuth && (
                    <div className="warning">
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{errorAuthMessage}</span>
                        </div>
                        {errorAuthMessage.includes("The email has not been confirmed") && (
                            <div>{errorAuthComponent}</div>
                        )}
                    </div>
                )}
                {emptyFields && (
                    <div className="error-warning">
                        <span>Please fill in all the fields</span>
                    </div>
                )}
            </React.Fragment>
        </Page >
    )
}

export default SignInPage