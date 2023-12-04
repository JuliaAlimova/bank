import './index.css';
import { Header } from '../header';
import { CommonProps, ButtonProps, TitleProps } from '../../contexts/commonProps';

export const Page: React.FC<CommonProps & ButtonProps & TitleProps> = ({ isNotification, isSettings, backButton, backButtonTitle, pageStyle, headerStyle, titleStyle, children, size, text, subText }) => {
    return (
        <div className='page' style={pageStyle}>
            <Header isNotification={isNotification} isSettings={isSettings} headerStyle={headerStyle} backButton={backButton} backButtonTitle={backButtonTitle} titleStyle={titleStyle} size={size} text={text} subText={subText} />
            <main className='main'>{children}</main>
            <div className='home'>
                <div className='homeIndicator'></div>
            </div>
        </div>
    )
}
