import './index.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../component/page';
import { TransactionProps, sizeTitle } from '../../contexts/commonProps';
import { useAuth } from '../../component/authRoute';
import { Divider } from '../../component/divider';

function TransactionPage(): React.ReactElement {

    const pageStyle = { backgroundColor: '#F5F5F7' };

    const headerStyle = {
        marginBottom: '34px',
    };

    const { transactionId } = useParams();

    const { state } = useAuth();
    const token = state ? state.token : '';
    const currentEmail = state && state.user ? state.user.email : '';

    const [errorMessage, setErrorMessage] = useState('');

    const [transaction, setTransaction] = useState<TransactionProps>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                        currentEmail,
                        transactionId,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    setTransaction(data);
                } else {
                    setErrorMessage(data.message)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [token, currentEmail, transactionId]);


    const dotIndex: number = transaction?.amount.indexOf('.') || -1;
    const integerPart = transaction?.amount.slice(0, dotIndex) || '';
    const decimalPart = transaction?.amount.slice(dotIndex + 1, dotIndex + 3) || '';

    const sign = transaction?.transactionType === 'Receipt' ? '+' : '-';
    const textColor = transaction?.transactionType === 'Receipt' ? '#24B277' : '';

    return (
        <Page pageStyle={pageStyle} headerStyle={headerStyle} backButtonTitle={true} text='Transaction' size={sizeTitle.MEDIUM} >
            <div className='transaction'>

                {transaction ? (
                    <React.Fragment>
                        <div className='transaction__amount' style={{ color: textColor }}>
                            {sign}${integerPart}<span className="transaction__amount--subNumber">.{decimalPart}</span>
                        </div>

                        <div className='transaction__description'>
                            <div className="description-field">
                                <span>Date</span>
                                <span>{transaction.date}</span>
                            </div>
                            <Divider />

                            <div className="description-field">
                                <span>Address</span>
                                <span>{transaction.receiver}</span>
                            </div>

                            <Divider />

                            <div className="description-field">
                                <span>Type</span>
                                <span>{transaction.transactionType}</span>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="warning">
                        <div className="user-warning">
                            <img src='/svg/danger.svg' alt='danger' />
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                )}

            </div>
        </Page>
    );
}

export default TransactionPage