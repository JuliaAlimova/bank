import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../contexts/AuthContext';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { sizeTitle } from '../../contexts/commonProps';

function SignUpPage(): React.ReactElement {
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const pageStyles = {
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
        setEmptyFields(false);
        setPasswordError(!isValid);
        setUserExistsMessage('');
    };

    const handleSignup = async () => {

        if (email.trim() === '' || password.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (emailError || passwordError) {
            return
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

            if (res.ok) {
                const data = await res.json();
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: data.token,
                        user: data.user,
                        isLogged: data.isLogged,
                    }
                });

                setUserExists(false);
                setUserExistsMessage('');
                navigate('/signup-confirm');
            } else {
                const errorData = await res.json();
                setUserExists(true);
                setUserExistsMessage(errorData.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Page backButton={true} headerStyle={pageStyles} text='Sign up' subText='Choose a registration method' size={sizeTitle.standart}>
            <React.Fragment>
                <form className='form'>
                    <Field type={'email'} name={'email'} placeholder={'example@gmail.com'} label={'Email'} formType='signUp' onChange={handleEmailChange} />
                    <Field type={'password'} name={'password'} placeholder={'Enter your password'} label={'Password'} formType='signUp' onChange={handlePasswordChange} />
                    <div>{'Already have an account? '}
                        <Link to={"/signin"}> Sign In</Link>
                    </div>
                    <div className='buttons'>
                        <Button onClick={handleSignup} textButton={'Continue'} />
                    </div>
                </form>
                {userExists && (
                    <div className="user-exists-warning">
                        <img src='/svg/danger.svg' alt='danger' />
                        <span>{userExistsMessage}</span>
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