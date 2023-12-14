import "./index.css";
import { BalanceFieldProps } from '../../contexts/commonProps';
import { Link } from 'react-router-dom';

export const BalanceField: React.FC<BalanceFieldProps> = ({ transactionId, srcLogo, title, date, transactionType, amount }) => {
  const dotIndex = amount.indexOf('.');
  const integerPart = amount.slice(0, dotIndex);
  const decimalPart = amount.slice(dotIndex + 1, dotIndex + 3);

  const commaIndex = date.indexOf(',');
  const time = date.slice(commaIndex + 1);

  const sign = transactionType === 'Receipt' ? '+' : '-';
  const textColor = transactionType === 'Receipt' ? '#24B277' : '';
  const subTextColor = transactionType === 'Receipt' ? '#26BF80' : '';

  return (
    <Link className="transaction-balance" to={`/transaction/${transactionId}`}>
      <div className="description">
        <div className="transaction-balance__logo-background">
          <img className="transaction-balance__logo" src={srcLogo} alt={title} />
        </div>
        <div className="details">
          <span>{title}</span>
          <div className="operation">
            <span>{time}</span>
            <img src='/svg/ellipse.svg' alt='dot' />
            <span>{transactionType}</span>
          </div>
        </div>
      </div>
      <div style={{ color: textColor }}>
        {sign}${integerPart}<span style={{ color: subTextColor }} className="subNumber">.{decimalPart}</span>
      </div>
    </Link>
  );
};
