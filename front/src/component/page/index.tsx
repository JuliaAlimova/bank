import './index.css';
import { Header } from '../header';
import { CommonProps, ButtonProps } from '../../contexts/commonProps';

export const Page: React.FC<CommonProps & ButtonProps> = ({ backButton, headerStyle, marginTopTitle, children, size, text, subText }) => {
    return (
        <div className='page'>
            <Header headerStyle={headerStyle} backButton={backButton} marginTopTitle={marginTopTitle} size={size} text={text} subText={subText} />
            <main className='main'>{children}</main>
            <div className='home'>
                <div className='homeIndicator'></div>
            </div>
        </div>
    )
}
