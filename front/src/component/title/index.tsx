import "./index.css";
import { CommonProps, ButtonProps, TitleProps } from '../../contexts/commonProps';
import { BackButton } from '../../component/back-button';
import { Link } from "react-router-dom";

export const Title: React.FC<CommonProps & ButtonProps & TitleProps> = ({ isNotification, isSettings, backButtonTitle, titleStyle, text, size, subText }) => {
    const isSubText: React.FC = () => {
        if (subText) {
            return <div className={`${size.toString()}SubText`}>{subText}</div>
        } else return null
    }

    const isBackButton: React.FC = () => {
        if (backButtonTitle) {
            return <BackButton />
        } else return null
    }

    return (
        <div className="title" style={titleStyle}>
            {isBackButton({ backButtonTitle })}
            {isSettings && (
                <Link className='link' to={"/settings"}>
                    <img src='/svg/settings.svg' alt='settings' />
                </Link>
            )}
            <div className="title-text">
                <h1 className={size.toString()}>{text}</h1>
                {isSubText({ subText })}
            </div>
            {isNotification && (
                <Link className='link' to={"/notifications"}>
                    <img src='/svg/notification.svg' alt='notifications' />
                </Link>
            )}
        </div>
    );
}