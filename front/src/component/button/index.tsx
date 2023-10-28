import React from "react";
import "./index.css";

import { ButtonProps } from '../../contexts/commonProps';

export const Button: React.FC<ButtonProps> = ({ onClick, textButton, disabled }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <button onClick={handleClick} className="button" disabled={disabled}>{textButton}</button>
    );
}