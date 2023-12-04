import React, { useState } from 'react';
import './index.css';
import { Page } from '../../component/page';
import { sizeTitle } from '../../contexts/commonProps';
import { Field } from '../../component/field';
import { Button } from '../../component/button';
import { Divider } from '../../component/divider';
import { useAuth } from '../../component/authRoute';

function SettingsPage(): React.ReactElement {

    const buttonStyle = {
        fontWeight: '400',
        fontSize: '14px',
        padding: '16px'
    }

    const { state, dispatch } = useAuth();

    const [newEmail, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);

    const token = state ? state.token : '';
    const currentEmail = state && state.user ? state.user.email : '';

    const handleEmailChange = (value: string, isValid: boolean) => {
        setEmail(value);
        setEmailError(!isValid);
        setError(false);
        setEmptyFields(false);
    };

    const handleCurrentPasswordChange = (value: string, isValid: boolean) => {
        setCurrentPassword(value);
        setPasswordError(!isValid);
        setError(false);
        setEmptyFields(false);
    };

    const handleNewPasswordChange = (value: string, isValid: boolean) => {
        setNewPassword(value);
        setPasswordError(!isValid);
        setError(false);
        setEmptyFields(false);
    };

    const handleOldPasswordChange = (value: string, isValid: boolean) => {
        setOldPassword(value);
        setPasswordError(!isValid);
        setError(false);
        setEmptyFields(false);
    };

    const handleChangeEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newEmail.trim() === '' || currentPassword.trim() === '') {
            setEmptyFields(true);
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newEmail,
                    currentPassword,
                    currentEmail,
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

                setEmail('');
                setCurrentPassword('');

                setErrorMessage('');
                setError(false);
                setEmptyFields(false);
            } else {
                setErrorMessage(data.message)
                setError(true)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword.trim() === '' || oldPassword.trim() === '') {
            setEmptyFields(true);
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    currentEmail,
                    oldPassword,
                    newPassword
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

                setOldPassword('');
                setNewPassword('');

                setErrorMessage('');
                setError(false);
                setEmptyFields(false);
            } else {
                setErrorMessage(data.message)
                setError(true)
            }
        } catch (error) {
            console.error(error);
        }

    }
    const handleLogOut = async () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('authState');
    }

    return (
        <Page backButtonTitle={true} text='Settings' size={sizeTitle.medium} >
            <div className='settings'>

                <form className='block' onSubmit={handleChangeEmail}>
                    <span className='title-field'>Change email</span>
                    <Field type={'email'} name={'newEmail'} placeholder={'example@gmail.com'} label={'New email'} formType='signUp' onChange={handleEmailChange} value={newEmail} />
                    <Field type={'password'} name={'currentPassword'} placeholder={'Enter your password'} label={'Your password'} formType='signUp' onChange={handleCurrentPasswordChange} value={currentPassword} />
                    <Button type='submit' buttonStyle={buttonStyle} textButton={'Save Email'} disabled={error || emailError || passwordError || Boolean(!currentPassword) || Boolean(!newEmail)} />
                </form>

                <Divider />

                <form className='block' onSubmit={handleChangePassword}>
                    <span className='title-field'>Change password</span>
                    <Field type={'password'} name={'oldPassword'} placeholder={'Enter your password'} label={'Old password'} formType='signUp' onChange={handleOldPasswordChange} value={oldPassword} />
                    <Field type={'password'} name={'newPassword'} placeholder={'Enter your password'} label={'New password'} formType='signUp' onChange={handleNewPasswordChange} value={newPassword} />
                    <Button type='submit' buttonStyle={buttonStyle} textButton={'Save Password'} disabled={passwordError || Boolean(!oldPassword) || Boolean(!newPassword)} />
                </form>

                <Divider />

                <Button onClick={handleLogOut} type='logout' buttonStyle={buttonStyle} textButton={'Log out'} />

                {error && (
                    <div className="warning">
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                )}
                {emptyFields && (
                    <div className="error-warning">
                        <span>Please fill in all the fields</span>
                    </div>
                )}

            </div>
        </Page >
    )
}

export default SettingsPage