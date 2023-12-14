import React from 'react';
import { useNavigate } from 'react-router';
import './index.css';
import { Page } from '../../component/page';
import { Button } from '../../component/button';
import { sizeTitle } from '../../contexts/commonProps';

function WellcomePage(): React.ReactElement {
    const navigate = useNavigate();

    const redirectToSignUp = () => {
        navigate("/signup");
    };
    const redirectToSignIn = () => {
        navigate("/signin");
    };

    const headerStyle = {
        background: `url('images/safe.png') no-repeat, url('images/background.png') no-repeat`,
        minHeight: '630px',
    };
    const titleStyle = {
        marginTop: '54px', color: '#fff'
    };

    return (
        <Page titleStyle={titleStyle} headerStyle={headerStyle} text='Hello!' size={sizeTitle.BIG} subText='Welcome to bank app' >
            <div className='buttons'>
                <Button textButton={'Sign Up'} onClick={redirectToSignUp} />
                <Button textButton={'Sign In'} onClick={redirectToSignIn} />
            </div>
        </Page >
    )
}

export default WellcomePage