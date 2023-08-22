export function formatDateFromNow(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  if (diffInMs < 60 * 1000) {
    // Less than a minute ago
    return "just now";
  }
  if (diffInMs < 60 * 60 * 1000) {
    // Less than an hour ago
    const diffInMin = Math.round(diffInMs / (60 * 1000));
    return `${diffInMin} minute ago`;
  }
  if (diffInMs < 24 * 60 * 60 * 1000) {
    // Less than a day ago
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  if (diffInMs < 2 * 24 * 60 * 60 * 1000) {
    // Yesterday
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `Yesterday at  ${hours}:${minutes}`;
  }
  // More than two days ago
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} at ${hours}:${minutes}`;
}

export function formatDateToRegularFormat(dateString: string) {
  const date = new Date(dateString);
  // More than two days ago
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} at ${hours}:${minutes}`;
}
