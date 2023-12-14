import "./index.css";
import { NotificationFieldProps } from '../../contexts/commonProps';
import getFormatDate from '../../util/getFormatDate';

export const NotificationField: React.FC<NotificationFieldProps> = ({ srcLogo, date, actionType, notificationType }) => {

  const formattedDate: string = getFormatDate({ date });

  return (
    <div className="notification">

      <div className="notification__logo-background">
        <img className="logo-notification" src={srcLogo} alt={actionType} />
      </div>

      <div className="notification__description">
        <div>{actionType}</div>
        <div className="notification-type">
          <span>{formattedDate}</span>
          <img src='/svg/ellipse.svg' alt='dot' />
          <span>{notificationType}</span>
        </div>
      </div>
    </div>
  );
};
