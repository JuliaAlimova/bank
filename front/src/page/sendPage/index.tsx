import React, { useState } from 'react';
import { useAuth } from '../../component/authRoute';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { SrcLogo, ActionType, NotificationType, sizeTitle } from '../../contexts/commonProps';

function SendPage(): React.ReactElement {
    const { state } = useAuth();
    const token = state.token;
    const currentEmail = state && state.user ? state.user.email : '';

    const pageStyle = { backgroundColor: '#F5F5F7' };
    const headerStyle = {
        marginBottom: '32px',
    };

    const [emptyFields, setEmptyFields] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(false);

    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const handleEmailChange = (value: string, isValid: boolean) => {
        setEmail(value);
        setEmailError(!isValid);
        setEmptyFields(false)
        setError(false);
        setSuccess(false);
    };

    const handleChangeAmount = (value: string, isValid: boolean) => {
        setAmount(value);
        if (value.trim() === '0' || value.trim() === '$0') {
            setAmountError(true);
        } else {
            setAmountError(!isValid);
        }
        setError(false);
        setSuccess(false);
        setEmptyFields(false);
    };

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (email.trim() === '' || amount.trim() === '') {
            setEmptyFields(true);
            return;
        } else if (emailError || amountError) {
            return
        }

        try {
            const numericAmount = parseFloat(amount.slice(1));
            const formattedNumericAmount = numericAmount.toFixed(2);

            const res = await fetch("http://localhost:4000/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    formattedNumericAmount,
                    receiver: email,
                    sender: currentEmail,
                    srcLogoNotification: SrcLogo.BELL,
                    srcLogoTransaction: SrcLogo.USER,
                    actionTypeSender: ActionType.SEND,
                    actionTypeReceiver: ActionType.RECEIVE,
                    notificationTypeSender: NotificationType.SEND,
                    notificationTypeReceiver: NotificationType.RECEIVE,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true)
                setSuccessMessage(`You have successfully sent ${formattedNumericAmount}$ to ${email}!`)
                setAmount('')
                setEmail('')
                setEmptyFields(false);
                setError(false);
            } else {
                setSuccess(false);
                setError(true)
                setErrorMessage(data.message)
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    }

    return (
        <Page pageStyle={pageStyle} headerStyle={headerStyle} backButtonTitle={true} text='Send' size={sizeTitle.MEDIUM} >
            <React.Fragment>
                <form className='form' onSubmit={handleSend}>

                    <Field type='email' name='email' placeholder='example@gmail.com' label='Email' formType='signIn' onChange={handleEmailChange} value={email} />
                    <Field type='text' name='amount' placeholder='Enter amount' label='Sum' onChange={handleChangeAmount} value={amount} />

                    <Button textButton={'Send'} disabled={emailError || amountError || Boolean(!email) || Boolean(!amount)} />

                </form>
                {emptyFields && (
                    <div className="error-warning">
                        <span>Please fill in all the fields</span>
                    </div>
                )}

                {success && (
                    <div className='success-message'>
                        <img src="/svg/check.svg" alt="check" />
                        <span>{successMessage}</span>
                    </div>
                )}
                {error && (
                    <div className="warning">
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                )}

            </React.Fragment>
        </Page >
    )
}

export default SendPage