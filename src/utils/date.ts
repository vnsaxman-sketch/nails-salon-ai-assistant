export function formatDate(
  dateString: string,
): string {
  const parts = dateString.split('-');

  if (parts.length !== 3) {
    return dateString;
  }

  const [year, month, day] = parts;

  return `${month}-${day}-${year}`;
}

export function getTodayString(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    today.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatLongDate(
  dateString: string,
): string {
  const date = new Date(
    `${dateString}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );
}
