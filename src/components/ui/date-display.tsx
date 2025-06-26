'use client';

interface DateDisplayProps {
  date: Date | string;
  format?: 'time' | 'datetime';
}

export const DateDisplay = ({ date, format = 'time' }: DateDisplayProps) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'time') {
    return (
      <time dateTime={dateObj.toISOString()}>
        {dateObj.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    );
  }

  return (
    <time dateTime={dateObj.toISOString()}>
      {dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </time>
  );
};
