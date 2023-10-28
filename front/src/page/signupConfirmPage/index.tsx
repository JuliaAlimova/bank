import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { useAuth } from '../../component/authRoute';
import { sizeTitle } from '../../contexts/commonProps';

function SignupConfirmPage(): React.ReactElement {
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const [emptyFields, setEmptyFields] = useState(false);
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [isValid, setIsValid] = useState(false);

    const { state } = useAuth();
    const token = state.token;

    const handleCodeChange = (value: string, isValid: boolean) => {
        setCode(value);
        setEmptyFields(false);
        setIsValid(isValid);
    };

    const pageStyles = {
        marginBottom: '32px',
    };

    const errorAuthComponent = <Link className='link' to={'/signup'}>Please sign up</Link>;

    const handleSignupConfirm = async () => {

        if (code.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (codeError) {
            return
        }

        try {
            const res = await fetch("http://localhost:4000/signup-confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    token: token,
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

                localStorage.setItem('authState', JSON.stringify(data));

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
        <Page backButton={true} headerStyle={pageStyles} text='Confirm account' subText='Write the code you received' size={sizeTitle.standart}>
            <React.Fragment>
                <Field type={'number'} name={'code'} placeholder={'123456'} label={'Code'} onChange={handleCodeChange} />
                <Button onClick={handleSignupConfirm} textButton={'Confirm'} disabled={!isValid} />
                {emptyFields && (
                    <div className="error-warning">
                        <span>Please fill in the field</span>
                    </div>
                )}
                {codeError && (
                    <div className="warning">
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{codeError}</span>
                        </div>
                        {codeError.includes("You are not logged in") && (
                            <div>{errorAuthComponent}</div>
                        )}
                    </div>
                )}
            </React.Fragment>
        </Page >
    )
}

export default SignupConfirmPage