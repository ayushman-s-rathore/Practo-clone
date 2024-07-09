const today=new Date()
export const getNextDays = (numDays) => {
    const daysArray = [];
    for (let i = 0; i < numDays; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      daysArray.push(formatDate(nextDay));
    }
    return daysArray;
  };
  const formatDate = (date) => {
    // const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}`;
  };