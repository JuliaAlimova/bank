import "./index.css";
import { useState, useEffect, useCallback } from 'react';
import { FieldProps } from '../../contexts/commonProps';

export const Field: React.FC<FieldProps> = ({ value, type, label, name, placeholder, formType, onChange }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [isValid, setIsValid] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasError, setHasError] = useState(false);

    const validateInput = useCallback((value: string): boolean => {
        if (value.trim() === '') {
            return false
        } else if (type === 'number') {
            return /^\d{6,}$/.test(value);
        } else if (type === 'text') {

            const formattedNumericAmount = parseFloat(value.slice(1));

            if (formattedNumericAmount === 0 || Math.abs(formattedNumericAmount) < Number.EPSILON) {
                return false;
            }
            return true;
        } else if (type === 'email') {
            const REG_EXP_EMAIL = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,}$/;
            return REG_EXP_EMAIL.test(value);
        } else if (type === 'password') {
            const REG_EXP_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            return REG_EXP_PASSWORD.test(value);
        }
        else return true

    }, [type]);

    const getErrorText = useCallback((): string | undefined => {

        if (!validateInput(inputValue)) {

            if (inputValue.trim() === '') {
                return 'This field cannot be empty.';
            }

            if (formType === 'signUp' && type === 'password') {
                return 'Sorry, the password is too simple. It should contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit.';
            } else if (formType === 'signUp' && type === 'email') {
                return 'Please enter a valid email address.';
            } else if (formType === 'signIn' && type === 'password') {
                return 'Please enter your password.';
            } else if (formType === 'signIn' && type === 'email') {
                return 'Invalid email address. Please check and try again.';
            } else if (type === 'number') {
                return 'Code must be at least 6 digits.';
            } else if (type === 'text') {
                return 'Please enter a valid amount greater than zero.';
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
        let value = e.target.value;
        let inputValid = validateInput(value);

        if (type === 'number') {
            if (value.length >= 6) {
                value = value.slice(0, 6);
            }
        }

        if (onChange) {
            onChange(value, inputValid);
        }

        if (type === 'text') {

            // Удаляем все символы, кроме цифр и точек
            value = value.replace(/[^\d.]/g, '');

            // Если точка является первым символом, добавляем "0" перед точкой
            if (value.indexOf('.') === 0) {
                value = '0' + value;
            }

            // Удаляем ведущие нули перед целой частью числа
            value = value.replace(/^0+(\d)/, '$1');

            if (value.indexOf('.') === value.lastIndexOf('.') && e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === '.') {
                return; // Предотвратить ввод новой точки
            }

            // Добавляем "$" только если значение не пустое
            if (value !== '') {
                value = `$${value}`;
            }

            // Проверка на количество точек
            const dotCount = value.split('.').length;
            if (dotCount > 2) {
                // Удалить последнюю точку
                value = value.slice(0, -1);
            }

            // Если есть точка, разделяем на целую и десятичную части
            const dotIndex = value.indexOf('.');

            if (dotIndex !== -1) {
                const integerPart = value.slice(0, dotIndex);
                const decimalPart = value.slice(dotIndex + 1, dotIndex + 3);
                const result = `${integerPart}.${decimalPart}`;

                if (onChange) {
                    onChange(result, inputValid);
                }
            } else {
                if (onChange) {
                    onChange(value, inputValid);
                }
            }
        }

        if (!isFocused) {
            setIsValid(inputValid);
        }

        if (!hasError) {
            setHasError(!inputValid && value.trim() !== '');
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

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    return (
        <div className={`field ${(!isValid && !isFocused) ? 'invalid' : ''}`}>
            <label htmlFor={name}>{label}</label>
            <div className="field__wrapper">
                <input
                    value={inputValue}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onChange={handleInputChange}
                    type={type === 'password' ? (passwordVisible ? 'text' : 'password') : type}
                    className={`field__input`}
                    name={name}
                    placeholder={placeholder}
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