const usdHtmlTemplate = (name, buy, sell) => {
  return `Currency exchange <b>${name}</b>:
  πΊπΈ <b>${Number(buy).toFixed(2)}</b> / πΊπ¦ <b>${Number(sell).toFixed(2)}</b>
  `;
};

module.exports = usdHtmlTemplate;
