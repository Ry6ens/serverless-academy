const weatherTitleHTML = ({ dt_txt }) => {
  const setDate = new Date(dt_txt.slice(0, 10));
  const getDate = setDate.getDate();
  const getMonth = setDate.toLocaleDateString('en-US', { month: 'long' });
  const getDayName = setDate.toLocaleDateString('en-US', { weekday: 'long' });

  return `\n<b>${getDayName}, ${getDate} ${getMonth}</b>`;
};

module.exports = weatherTitleHTML;
