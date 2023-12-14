import React, { useState, useEffect } from 'react';
import './index.css';
import { Page } from '../../component/page';
import { sizeTitle, NotificationFieldProps } from '../../contexts/commonProps';
import { useAuth } from '../../component/authRoute';
import { NotificationField } from '../../component/notification-field';

function NotificationsPage(): React.ReactElement {

    const pageStyle = { backgroundColor: '#F5F5F7' };
    const headerStyle = {
        marginBottom: '32px',
    };

    const { state } = useAuth();

    const token = state ? state.token : '';
    const currentEmail = state && state.user ? state.user.email : '';

    const [notifications, setNotifications] = useState<NotificationFieldProps[]>([]);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4000/notifications', {
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
                    setNotifications(data);
                } else {
                    setErrorMessage(data.message)
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [token, currentEmail]);

    return (
        <Page pageStyle={pageStyle} headerStyle={headerStyle} backButtonTitle={true} text='Notifications' size={sizeTitle.MEDIUM} >
            {errorMessage ? (
                <div className="warning">
                    <div className="user-warning">
                        <img src='/svg/danger.svg' alt='danger' />
                        <span>{errorMessage}</span>
                    </div>
                </div>

            ) : (
                <div className='notifications'>
                    {notifications.map(notification => (
                        <NotificationField
                            key={notification.id}
                            srcLogo={notification.srcLogo}
                            date={notification.date}
                            actionType={notification.actionType}
                            notificationType={notification.notificationType} />
                    ))}
                </div>
            )}
        </Page >
    )
}

export default NotificationsPage