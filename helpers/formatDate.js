const formatDate = (date) => {
  let current_datetime = date;
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate();
  return formatted_date;
};

export default formatDate;
