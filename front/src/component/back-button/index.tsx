import "./index.css";
import { useNavigate } from 'react-router-dom';


export const BackButton: React.FC = () => {
    const navigate = useNavigate();

    const backButton = () => {
        navigate(-1)
    }

    return (
        <div className="back-button" onClick={backButton}>
            <img src="/svg/back-button.svg" alt="<" width="24" height="24" />
        </div>
    );
}