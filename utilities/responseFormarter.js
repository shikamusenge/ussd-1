const formatResponse = (data) => {
  const { title = "", body = "", list = [], footer = "", type = "END" } = data;
  let lists = ``;
  list.forEach((item, index) => {
    lists += ` ${index + 1}. ${item}\n`;
  });

  const res = `${type} ${title} \n ${body} \n ${lists} \n ${footer} \n`;

  res.replace("\n \n", "\n");
  return res;
};

module.exports = formatResponse;
