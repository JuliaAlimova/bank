import getCurrentTime from "../../util/getCurrentTime";
import { Title } from '../title';
import { BackButton } from '../../component/back-button';
import { CommonProps, ButtonProps, TitleProps } from '../../contexts/commonProps';
import './index.css';

export const Header: React.FC<CommonProps & ButtonProps & TitleProps> = ({ isNotification, isSettings, backButton, backButtonTitle, headerStyle, titleStyle, size, text, subText }) => {
    const time: string = getCurrentTime();

    const isBackButton: React.FC = () => {
        if (backButton) {
            return <BackButton />
        } else return null
    }

    return (
        <header className="header" style={headerStyle}>
            <div className="statusBar">
                <div className="time">{time}</div>
                <div className="statusBar__icons">
                    <img src="/svg/cellular.svg" alt="cellular" />
                    <img src="/svg/wifi.svg" alt="wifi" />
                    <img src="/svg/battery.svg" alt="battery" />
                </div>
            </div>
            {isBackButton({ backButton })}
            <Title backButtonTitle={backButtonTitle} isNotification={isNotification} isSettings={isSettings} titleStyle={titleStyle} size={size} text={text} subText={subText} />
        </header>
    )
}