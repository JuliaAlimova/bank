import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { Field } from '../../component/field';
import { useAuth } from '../../contexts/AuthContext';
import { sizeTitle } from '../../contexts/commonProps';

function BalancePage(): React.ReactElement {
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [emptyFields, setEmptyFields] = useState(false);
    const [error, setError] = useState('');

    const { state } = useAuth();
    const token = state.token;


    const handleCodeChange = (value: string, isValid: boolean) => {
        setCode(value);
        setEmptyFields(false)
    };


    const pageStyles = {
        marginBottom: '32px',
    };

    const handleBalance = async () => {


        if (code.trim() === '') {
            setEmptyFields(true);
            return;
        }

        try {
            console.log('Sending request with code:', code, 'and token:', token);
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

            if (res.ok) {
                const data = await res.json();
                console.log('Server response data:', data);


                setEmptyFields(false);
                navigate('/balance');
            } else {
                const errorData = await res.json();
                setError(errorData.message);
            }
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <Page backButton={true} headerStyle={pageStyles} text='Confirm account' subText='Write the code you received' size={sizeTitle.standart}>
            <React.Fragment>
                <Field type={'number'} name={'code'} placeholder={'1234'} label={'Code'} maxLength={4} onChange={handleCodeChange} />
                <Button onClick={handleBalance} textButton={'Confirm'} />
                {emptyFields && (
                    <div className="error-warning">
                        <span>Please fill in the field</span>
                    </div>
                )}
                {error && (
                    <div className="error-warning">
                        <span>{error}</span>
                    </div>
                )}

            </React.Fragment>
        </Page >
    )
}

export default BalancePage