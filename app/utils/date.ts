export const formatDate = (date: string) => {
  const d = new Date(date);

  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${month}月${day}日`;
};

export const formatDateDetail = (date: string) => {
  const d = new Date(date);

  const hours = d.getHours();
  const minutes = d.getMinutes();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${hours}:${minutes}・${year}年${month}月${day}日`;
};
