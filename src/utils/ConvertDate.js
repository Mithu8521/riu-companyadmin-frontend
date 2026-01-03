const ConvertDate = (dateString) => {
  let date = dateString.toString().slice(4, 15);

  let objectDate = new Date(date);

  let day = objectDate.getDate();
  let month = objectDate.getMonth();
  let year = objectDate.getFullYear();

  return `${day}-${month + 1}-${year}`;
};

export default ConvertDate;
