const euroHtmlTemplate = (name, buy, sell) => {
  return `Currency exchange <b>${name}</b>:
  🇪🇺 <b>${Number(buy).toFixed(2)}</b> / 🇺🇦 <b>${Number(sell).toFixed(2)}</b>
    `;
};

module.exports = euroHtmlTemplate;
