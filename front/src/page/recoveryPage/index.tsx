import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { useAuth } from '../../component/authRoute';
import { sizeTitle } from '../../contexts/commonProps';

function RecoveryPage(): React.ReactElement {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);
    const [errorAuth, setErrorAuth] = useState(false);
    const [errorAuthMessage, setErrorAuthMessage] = useState('');

    const { state } = useAuth();
    const token = state.token;

    const errorAuthComponent = <Link className='link' to={'/signup-confirm'}>Confirm email</Link>;

    const handleEmailChange = (value: string, isValid: boolean) => {
        setEmail(value);
        setEmailError(!isValid);
        setErrorAuth(false);
    };

    const pageStyles = {
        marginBottom: '32px',
    };

    const handleRecovery = async () => {

        if (email.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (emailError) {
            return
        }

        try {
            const res = await fetch("http://localhost:4000/recovery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    token: token,
                }),
            });

            const data = await res.json();

            console.log(data)


            if (res.ok) {

                setErrorAuthMessage('');
                setErrorAuth(false);
                setEmptyFields(false);
                navigate('/recovery-confirm');
            } else {
                setErrorAuthMessage(data.message)
                setErrorAuth(true)
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Page backButton={true} headerStyle={pageStyles} text='Recover password' subText='Choose a recovery method' size={sizeTitle.standart}>
            <React.Fragment>
                <Field type={'email'} name={'email'} placeholder={'example@gmail.com'} label={'Email'} formType='signIn' onChange={handleEmailChange} />
                <Button onClick={handleRecovery} textButton={'Send code'} disabled={emailError || Boolean(!email)} />
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
                    <div className="warning">
                        <span>Please fill in the field</span>
                    </div>
                )}
            </React.Fragment>
        </Page >
    )
}

export default RecoveryPage