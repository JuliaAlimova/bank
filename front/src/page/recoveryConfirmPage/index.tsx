import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../component/authRoute';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { SrcLogo, ActionType, NotificationType, sizeTitle } from '../../contexts/commonProps';

function RecoveryConfirmPage(): React.ReactElement {
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const { state } = useAuth();
    const token = state.token;

    const headerStyle = {
        marginBottom: '32px',
    };

    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState(false);
    const [codeErrorMessage, setCodeErrorMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);

    const handleCodeChange = (value: string, isValid: boolean) => {
        setCode(value);
        setEmptyFields(false);
        setIsValid(isValid);
        setCodeError(false);
    };

    const handlePasswordChange = (value: string, isValid: boolean) => {
        setPassword(value);
        setEmptyFields(false);
        setPasswordError(!isValid);
        setCodeError(false);
    };

    const handleRecoveryConfirm = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (password.trim() === '' || code.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (passwordError || codeError) {
            return
        }

        try {
            const res = await fetch("http://localhost:4000/recovery-confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: password,
                    code: code,
                    token: token,
                    srcLogo: SrcLogo.DANGER,
                    actionType: ActionType.RECOVERY,
                    notificationType: NotificationType.RECOVERY,
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

                setEmptyFields(false);
                setPasswordError(false);
                setIsValid(false);
                setCodeError(false);
                navigate('/balance');
            } else {
                setCodeError(true);
                setCodeErrorMessage(data.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Page backButton={true} headerStyle={headerStyle} text='Recover password' subText='Write the code you received' size={sizeTitle.STANDARD}>
            <React.Fragment>
                <form className='form' onSubmit={handleRecoveryConfirm}>

                    <Field type={'number'} name={'code'} placeholder={'123456'} label={'Code'} onChange={handleCodeChange} value={code} />
                    <Field type={'password'} name={'password'} placeholder={'Enter your password'} label={'New password'} formType='signUp' onChange={handlePasswordChange} value={password} />

                    <div className='buttons'>
                        <Button textButton={'Restore password'} disabled={!isValid || passwordError || Boolean(!password)} />
                    </div>

                </form>
                {codeError && (
                    <div className='warning'>
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{codeErrorMessage}</span>
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

export default RecoveryConfirmPage