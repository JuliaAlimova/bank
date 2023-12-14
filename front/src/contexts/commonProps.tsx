export enum sizeTitle {
    BIG = 'big',
    STANDARD = 'standart',
    MEDIUM = 'medium',
    SMALL = 'small'
}

export enum SrcLogo {
    STRIPE = '/svg/stripe.svg',
    COINBASE = '/svg/coin.svg',
    USER = '/svg/user.svg',
    DANGER = '/svg/danger-red.svg',
    BELL = '/svg/bell-ringing.svg',
}

export enum ActionType {
    LOGIN = 'New login',
    RECOVERY = 'Password recovery',
    NEWPASSWORD = 'Password change',
    NEWEMAIL = 'Email change',
    RECEIVE = 'New reward system',
    SEND = 'New send reward',
}

export enum NotificationType {
    LOGIN = 'Warning',
    RECOVERY = 'Warning',
    NEWPASSWORD = 'Warning',
    NEWEMAIL = 'Warning',
    RECEIVE = 'Announcement',
    SEND = 'Announcement',
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
    label?: string,
    formType?: 'signIn' | 'signUp';
    onChange?: (value: string, isValid: boolean) => void;
    value?: string;
}

export interface BalanceFieldProps {
    transactionId: number,
    srcLogo: string,
    title: string,
    date: string,
    transactionType: string,
    amount: string,
}

export interface NotificationFieldProps {
    id?: number,
    srcLogo: string,
    date: string,
    actionType: string,
    notificationType: string,
}

export interface TransactionProps {
    key: number;
    sender: string;
    srcLogo: SrcLogo,
    id: number;
    date: string;
    amount: string;
    transactionType: string;
    source: string;
    receiver: string;
}