import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../component/authRoute';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { sizeTitle } from '../../contexts/commonProps';

function SignUpPage(): React.ReactElement {
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const headerStyle = {
        marginBottom: '32px',
    };

    const [userExists, setUserExists] = useState(false);
    const [userExistsMessage, setUserExistsMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);

    const handleEmailChange = (value: string, isValid: boolean) => {
        setEmail(value);
        setEmptyFields(false)
        setEmailError(!isValid);
        setUserExists(false);
        setUserExistsMessage('');
    };

    const handlePasswordChange = (value: string, isValid: boolean) => {
        setPassword(value);
        setEmptyFields(false)
        setPasswordError(!isValid);
        setUserExists(false);
        setUserExistsMessage('');
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (emailError || passwordError) {
            return;
        }

        try {

            const res = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await res.json();

            if (res.ok) {

                localStorage.setItem('authState', JSON.stringify(data));

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: data.token,
                        user: data.user,
                    }
                });

                setEmptyFields(false);
                setUserExists(false);
                setUserExistsMessage('');
                navigate('/signup-confirm');
            } else {
                setUserExists(true);
                setUserExistsMessage(data.message);
            }
        }
        catch (e) {
            console.error(e);
        }

    }

    return (
        <Page backButton={true} headerStyle={headerStyle} text='Sign up' subText='Choose a registration method' size={sizeTitle.standart}>
            <React.Fragment>
                <form className='form' onSubmit={handleSignup}>
                    <Field type={'email'} name={'email'} placeholder={'example@gmail.com'} label={'Email'} formType='signUp' onChange={handleEmailChange} value={email} />
                    <Field type={'password'} name={'password'} placeholder={'Enter your password'} label={'Password'} formType='signUp' onChange={handlePasswordChange} value={password} />
                    <div>{'Already have an account? '}
                        <Link className='link' to={"/signin"}> Sign In</Link>
                    </div>
                    <div className='buttons'>
                        <Button type='submit' textButton={'Continue'} disabled={emailError || passwordError || Boolean(!password) || Boolean(!email)} />
                    </div>
                </form>
                {userExists && (
                    <div className='warning'>
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{userExistsMessage}</span>
                        </div>
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

export default SignUpPage