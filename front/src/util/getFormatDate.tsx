import { useEffect, useState } from "react";

function getFormatDate(date: Date | string): string {
    const now: Date = new Date();

    const minutesDifference: number = Math.floor(
        (now.getTime() - new Date(date).getTime()) / (1000 * 60),
    )
    const daysDifference: number = Math.floor(
        minutesDifference / (24 * 60),
    )

    if (minutesDifference < 60) {
        return `${minutesDifference} min. ago`;
    } else if (daysDifference < 1) {
        const formattedDate = new Date(date);
        const hours = formattedDate.getHours();
        const minutes = formattedDate.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    } else {
        return new Date(date).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
        });
    }
}

function Component({ date }: { date: string }): string {
    const [formattedDate, setFormattedDate] = useState(getFormatDate(date));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFormattedDate(getFormatDate(date));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [date]);

    return formattedDate;
}

export default Component;