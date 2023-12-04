import React from "react";
import "./index.css";

import { ButtonProps } from '../../contexts/commonProps';

export const Button: React.FC<ButtonProps> = ({ type, buttonStyle, onClick, textButton, disabled }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <button style={buttonStyle} onClick={handleClick} className={`button ${type === 'logout' ? 'button-logout' : ''}`} disabled={disabled}>{textButton}</button>
    );
}