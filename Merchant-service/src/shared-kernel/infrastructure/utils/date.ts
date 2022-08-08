export function getFormattedDate(): string {
  const current_date = new Date();
  const formatted_date =
    current_date.getFullYear() +
    '-' +
    (current_date.getMonth() + 1) +
    '-' +
    current_date.getDate() +
    ' ' +
    current_date.getHours() +
    ':' +
    current_date.getMinutes() +
    ':' +
    current_date.getSeconds();
  return formatted_date;
}


