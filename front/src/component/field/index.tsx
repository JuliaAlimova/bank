import "./index.css";
import { useState, useEffect, useCallback } from 'react';
import { FieldProps } from '../../contexts/commonProps';

export const Field: React.FC<FieldProps> = ({ type, label, name, placeholder, formType, maxLength, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasError, setHasError] = useState(false);

    const validateInput = useCallback((value: string): boolean => {

        if (type === 'email') {
            const REG_EXP_EMAIL = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,}$/;
            return REG_EXP_EMAIL.test(value);
        } else if (type === 'password') {
            const REG_EXP_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            return REG_EXP_PASSWORD.test(value);
        }

        return true;
    }, [type]);

    const getErrorText = useCallback((): string | undefined => {
        if (formType === 'signUp' && type === 'password') {
            if (!validateInput(inputValue)) {
                return 'Sorry, the password is too simple. It should contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit.';
            }
        } else if (formType === 'signUp' && type === 'email') {
            if (!validateInput(inputValue)) {
                return 'Please enter a valid email address.';
            }
        }
        return undefined;
    }, [formType, inputValue, type, validateInput]);

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const inputValid = validateInput(value);

        setIsValid(inputValid);

        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setHasError(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const inputValid = validateInput(value);

        setInputValue(value);

        if (!isFocused) {
            setIsValid(inputValid);
        }

        if (!hasError) {
            setHasError(!inputValid && value.trim() !== '');
        }

        if (onChange) {
            onChange(value, inputValid);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        if (!isFocused) {
            const errorText = getErrorText();
            setHasError(!!errorText);
        }
    }, [getErrorText, hasError, isFocused]);

    return (
        <div className={`field ${(!isValid && !isFocused) ? 'invalid' : ''}`}>
            <label htmlFor={name}>{label}</label>
            <div className="field__wrapper">
                <input
                    maxLength={maxLength}
                    value={inputValue}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onChange={handleInputChange}
                    type={type === 'password' ? (passwordVisible ? 'text' : 'password') : type}
                    className="field__input"
                    name={name}
                    placeholder={placeholder}
                    required
                />
                {type === 'password' && (
                    <span
                        onClick={togglePasswordVisibility}
                        className={`field__icon ${passwordVisible ? 'show' : 'hide'}`}
                        style={{
                            top: hasError && type === 'password' ? '18px' : 'calc(50% - 9px)'
                        }}></span>
                )}
                {!isValid && !isFocused && (
                    <div className="error-text" style={{ top: hasError ? 'calc(100% + 8px)' : '0' }}>{getErrorText()}</div>
                )}
            </div>
        </div>
    );
};