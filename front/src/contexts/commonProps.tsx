export enum sizeTitle {
    big = 'big',
    standart = 'standart',
    medium = 'medium',
    small = 'small'
}

enum SrcLogo {
    Stripe = '/svg/stripe.svg',
    Coinbase = '/svg/coin.svg',
    User = '/svg/user.svg',
}


export interface CommonProps {
    children?: React.ReactElement,
    headerStyle?: React.CSSProperties,
    pageStyle?: React.CSSProperties,
}

export interface TitleProps {
    text: string,
    subText?: string,
    size: sizeTitle,
    titleStyle?: React.CSSProperties,
    isNotification?: boolean,
    isSettings?: boolean,
    backButtonTitle?: boolean,
}

export interface ButtonProps {
    textButton?: string,
    onClick?: () => void,
    backButton?: boolean,
    disabled?: boolean,
    buttonStyle?: React.CSSProperties,
    type?: string,
}

export interface FieldProps {
    placeholder: string,
    name: string,
    type: string,
    label: string,
    formType?: 'signIn' | 'signUp';
    onChange?: (value: string, isValid: boolean) => void;
    value?: string;
}

export interface BalanceFieldProps {
    srcLogo: string,
    title: string,
    date: string,
    transactionType: string,
    amount: string,
}

export interface Transaction {
    key: number;
    srcLogo: string | SrcLogo,
    id: number;
    date: string;
    amount: string;
    transactionType: string;
    source: string;
}