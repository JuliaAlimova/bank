export enum sizeTitle {
    big = 'big',
    standart = 'standart',
    small = 'small'
}

export interface CommonProps {
    children?: React.ReactElement,
    text: string,
    subText?: string,
    size: sizeTitle,
    headerStyle?: React.CSSProperties,
    marginTopTitle?: React.CSSProperties,
}

export interface ButtonProps {
    textButton?: string,
    onClick?: () => void,
    backButton?: boolean,
}

export interface FieldProps {
    placeholder: string,
    name: string,
    type: string,
    label: string,
    formType?: 'signIn' | 'signUp';
    maxLength?: number;
    onChange?: (value: string, isValid: boolean) => void;
}