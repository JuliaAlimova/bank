import React, { useEffect, useState } from 'react';
import './index.css';
import { Page } from '../../component/page';
import { sizeTitle } from '../../contexts/commonProps';
import { Link } from 'react-router-dom';
import { BalanceField } from '../../component/balance-field'
import { useAuth } from '../../component/authRoute';
import { Transaction } from '../../contexts/commonProps';


function BalancePage(): React.ReactElement {

    const headerStyle = {
        background: `url('images/balance-bg.png') no-repeat`,
        minHeight: '201px',
        borderRadius: '24px 24px 0 0',
    };
    const titleStyle = { color: '#F3F5FF' };

    const { state } = useAuth();

    const token = state ? state.token : '';
    const currentEmail = state && state.user ? state.user.email : '';


    const [balance, setBalance] = useState('0');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/balance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                        currentEmail
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    setBalance(data.user.balance);
                    setTransactions(data.user.transactions);
                }

                console.log(data)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [token, currentEmail]);

    const [integerPart, decimalPart] = balance.split('.');

    return (
        <Page titleStyle={titleStyle} headerStyle={headerStyle} text='Main wallet' size={sizeTitle.small} isNotification={true} isSettings={true}>
            <React.Fragment>
                <div className="balance">
                    <span>$</span>
                    <div>{integerPart}<span className='subNumber'>.{decimalPart || '00'}</span></div>
                </div>
                <div className='balance__control'>
                    <Link className='link' to={"/recive"}>
                        <div className='balance__action'>
                            <img src="/images/arrow-down-right.png" alt="cellular" />
                            <span>Receive</span>
                        </div>
                    </Link>
                    <Link className='link' to={"/send"}>
                        <div className='balance__action'>
                            <img src="/images/people-upload.png" alt="cellular" />
                            <span>Send</span>
                        </div>
                    </Link>
                </div>
                <div className='transactions'>
                    {transactions.map(transaction =>
                    (
                        <BalanceField
                            key={transaction.id}
                            srcLogo={transaction.source === 'Stripe' ? 'svg/stripe.svg' : 'svg/coin.svg'}
                            title={transaction.source}
                            date={transaction.date}
                            transactionType={transaction.transactionType}
                            amount={transaction.amount} />
                    ))}
                </div>
            </React.Fragment>
        </Page >
    )
}

export default BalancePage