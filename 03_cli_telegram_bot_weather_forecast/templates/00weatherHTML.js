const weather00HtmlTemplate = ({ dt_txt, main, weather }) => {
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

  if (dt_txt.slice(11, 16) === '00:00') {
    return `\n<b>${getDayName}, ${getDate} ${getMonth}</b> \n${dt_txt.slice(
      11,
      16
    )},  🌡 ${temparature(main.temp)} °C,  ${weather[0].description}`;
  }

  switch (weather[0].main) {
    case 'Clouds':
      return `${dt_txt.slice(11, 16)},  🌡 ${temparature(main.temp)} °C, ☁️ ${
        weather[0].description
      }`;
    case 'Rain':
      return `${dt_txt.slice(11, 16)},  🌡 ${temparature(main.temp)} °C, 🌧 ${
        weather[0].description
      }`;
    case 'Snow':
      return `${dt_txt.slice(11, 16)},  🌡 ${temparature(main.temp)} °C, ❄️ ${
        weather[0].description
      }`;
    case 'Clear':
      return `${dt_txt.slice(11, 16)},  🌡 ${temparature(main.temp)} °C, ☀️ ${
        weather[0].description
      }`;
    default:
      `${dt_txt.slice(11, 16)},  🌡 ${temparature(main.temp)} °C,  ${
        weather[0].description
      }`;
  }
};

module.exports = weather00HtmlTemplate;
