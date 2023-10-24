import "./index.css";
import { CommonProps, ButtonProps } from '../../contexts/commonProps';
import { BackButton } from '../../component/back-button';

export const Title: React.FC<CommonProps & ButtonProps> = ({ backButton, marginTopTitle, text, size, subText }) => {
    const isSubText: React.FC = () => {
        if (subText) {
            return <div className={`${size.toString()}SubText`}>{subText}</div>
        } else return null
    }

    const isBackButton: React.FC = () => {
        if (backButton) {
            return <BackButton />
        } else return null
    }

    return (
        <div className="title" style={marginTopTitle}>
            {isBackButton({ backButton })}
            <div className="title-text">
                <h1 className={size.toString()}>{text}</h1>
                {isSubText({ subText })}
            </div>
        </div>
    );
}