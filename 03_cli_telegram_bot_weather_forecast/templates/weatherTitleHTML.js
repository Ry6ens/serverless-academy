const weatherTitleHTML = ({ dt_txt, main, weather }) => {
  const setDate = new Date(dt_txt.slice(0, 10));
  const getDate = setDate.getDate();
  const getMonth = setDate.toLocaleDateString('en-US', { month: 'long' });
  const getDayName = setDate.toLocaleDateString('en-US', { weekday: 'long' });

  const temparature = temp => {
    const tempRound = temp.toFixed(0);
    const charc = tempRound.charAt(0);

    if (tempRound.charAt(1) === '0') {
      return `${tempRound.replace(charc, ' ')}`;
    }

    if (tempRound.charAt(0) !== '-') {
      return `+${tempRound}`;
    }
    return `${tempRound}`;
  };

  return `\n<b>${getDayName}, ${getDate} ${getMonth}</b> \n`;
};

module.exports = weatherTitleHTML;
