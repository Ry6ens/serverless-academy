const euroHtmlTemplate = (name, buy, sell) => {
  return `Currency exchange <b>${name}</b>:
  πͺπΊ <b>${Number(buy).toFixed(2)}</b> / πΊπ¦ <b>${Number(sell).toFixed(2)}</b>
    `;
};

module.exports = euroHtmlTemplate;
