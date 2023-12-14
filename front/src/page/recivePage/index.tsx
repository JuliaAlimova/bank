import React, { useState } from 'react';
import './index.css';
import { Page } from '../../component/page';
import { SrcLogo, ActionType, NotificationType, sizeTitle } from '../../contexts/commonProps';
import { Divider } from '../../component/divider';
import { useAuth } from '../../component/authRoute';
import { Field } from '../../component/field';

function RecivePage(): React.ReactElement {

    const pageStyle = { backgroundColor: '#F5F5F7' };

    const { state } = useAuth();

    const token = state ? state.token : '';
    const currentEmail = state && state.user ? state.user.email : '';

    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const [amount, setAmount] = useState('');

    const handleChangeAmount = (value: string) => {
        setAmount(value);
        setError(false);
        setSuccess(false);
    };

    const handlePaymentSystemClick = async (sender: string, srcLogoTransaction: SrcLogo) => {
        try {
            const numericAmount = parseFloat(amount.slice(1));
            const formattedNumericAmount = numericAmount.toFixed(2);

            const res = await fetch('http://localhost:4000/recive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    formattedNumericAmount,
                    receiver: currentEmail,
                    sender,
                    srcLogoTransaction,
                    srcLogoNotification: SrcLogo.BELL,
                    actionType: ActionType.RECEIVE,
                    notificationType: NotificationType.RECEIVE,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true)
                setSuccessMessage(`You have successfully added ${formattedNumericAmount}$ to your account!`);
                setAmount('')
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
        <Page pageStyle={pageStyle} backButtonTitle={true} text='Receive' size={sizeTitle.MEDIUM} >
            <div className='receive'>

                <div className='block'>
                    <span className='title'>Receive amount</span>
                    <Field type={'text'} name={'amount'} placeholder={'Enter amount'} onChange={handleChangeAmount} value={amount} />
                </div>

                <Divider />

                <div className='block'>
                    <span className='title'>Payment system</span>

                    <div className='system' onClick={() => handlePaymentSystemClick('Stripe', SrcLogo.STRIPE)}>
                        <div className='left-path-system'>
                            <img src="/svg/stripe.svg" alt="stripe" />
                            <span className='title'>Stripe</span>
                        </div>
                        <div className='right-path-system'>
                            <img src="/svg/payment-system-1.svg" alt="payment-system" />
                            <img src="/svg/payment-system-2.svg" alt="payment-system" />
                            <img src="/svg/payment-system-3.svg" alt="payment-system" />
                            <img src="/svg/payment-system-4.svg" alt="payment-system" />
                            <img src="/svg/payment-system-5.svg" alt="payment-system" />
                            <img src="/svg/payment-system-6.svg" alt="payment-system" />
                        </div>
                    </div>

                    <div className='system' onClick={() => handlePaymentSystemClick('Coinbase', SrcLogo.COINBASE)}>
                        <div className='left-path-system'>
                            <img src="/svg/coin.svg" alt="coinbase" />
                            <span className='title'>Coinbase</span>
                        </div>
                        <div className='right-path-system'>
                            <img src="/svg/payment-system-2.svg" alt="payment-system" />
                            <img src="/svg/payment-system-1.svg" alt="payment-system" />
                            <img src="/svg/payment-system-4.svg" alt="payment-system" />
                            <img src="/svg/payment-system-3.svg" alt="payment-system" />
                            <img src="/svg/payment-system-6.svg" alt="payment-system" />
                            <img src="/svg/payment-system-5.svg" alt="payment-system" />
                        </div>
                    </div>
                </div>

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

            </div>
        </Page >
    )
}

export default RecivePage