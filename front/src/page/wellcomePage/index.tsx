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

    const pageStyles = {
        background: `url('images/safe.png') no-repeat, url('images/background.png') no-repeat`,
        minHeight: '630px',
    };
    const marginTopTitle = { marginTop: '54px' };

    return (
        <Page marginTopTitle={marginTopTitle} headerStyle={pageStyles} text='Hello!' size={sizeTitle.big} subText='Welcome to bank app' >
            <div className='buttons'>
                <Button textButton={'Sign Up'} onClick={redirectToSignUp} />
                <Button textButton={'Sign In'} onClick={redirectToSignIn} />
            </div>
        </Page >
    )
}

export default WellcomePage