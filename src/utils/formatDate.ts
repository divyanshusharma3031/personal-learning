export function formatDate(date: string | Date) {
  if(!date)
  {
    date="2003-03-31"
  }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  }