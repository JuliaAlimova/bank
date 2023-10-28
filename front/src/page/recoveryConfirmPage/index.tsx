import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../component/authRoute';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { sizeTitle } from '../../contexts/commonProps';

function RecoveryConfirmPage(): React.ReactElement {
    const navigate = useNavigate();
    const { state } = useAuth();
    const token = state.token;

    const pageStyles = {
        marginBottom: '32px',
    };

    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [emptyFields, setEmptyFields] = useState(false);

    const handleCodeChange = (value: string, isValid: boolean) => {
        setCode(value);
        setEmptyFields(false);
        setIsValid(isValid);
    };

    const handlePasswordChange = (value: string, isValid: boolean) => {
        setPassword(value);
        setEmptyFields(false)
        setPasswordError(!isValid);
    };

    const handleRecoveryConfirm = async () => {

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

                }),
            });

            const data = await res.json();

            if (res.ok) {

                setEmptyFields(false);
                navigate('/balance');
            } else {
                setCodeError(data.message);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Page backButton={true} headerStyle={pageStyles} text='Recover password' subText='Write the code you received' size={sizeTitle.standart}>
            <React.Fragment>
                <form className='form'>

                    <Field type={'number'} name={'code'} placeholder={'123456'} label={'Code'} onChange={handleCodeChange} />
                    <Field type={'password'} name={'password'} placeholder={'Enter your password'} label={'New password'} formType='signUp' onChange={handlePasswordChange} />

                    <div className='buttons'>
                        <Button onClick={handleRecoveryConfirm} textButton={'Restore password'} disabled={!isValid || passwordError || Boolean(!password)} />
                    </div>

                </form>
                {codeError && (
                    <div className='warning'>
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{codeError}</span>
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