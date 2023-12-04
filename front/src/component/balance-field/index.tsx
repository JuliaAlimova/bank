import "./index.css";
import { BalanceFieldProps } from '../../contexts/commonProps';


export const BalanceField: React.FC<BalanceFieldProps> = ({ srcLogo, title, date, transactionType, amount }) => {
  const dotIndex = amount.indexOf('.');
  const integerPart = amount.slice(0, dotIndex);
  const decimalPart = amount.slice(dotIndex + 1, dotIndex + 3);

  const commaIndex = date.indexOf(',');
  const time = date.slice(commaIndex + 1);

  const sign = transactionType === 'Recive' ? '+' : '-';
  const textColor = transactionType === 'Recive' ? '#24B277' : '';
  const subTextColor = transactionType === 'Recive' ? '#26BF80' : '';

  return (
    <div className="transaction">
      <div className="description">
        <div className="logo-background">
          <img src={srcLogo} alt={title} />
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
    </div>
  );
};
