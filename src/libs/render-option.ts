export function renderPage(pageData) {
  let render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(render_options).then(function (textContent) {
    let text = '';
    let sortedItems = textContent.items.sort(
      (a, b) => b.transform[5] - a.transform[5],
    );
    let sort = groupByLine(sortedItems, 5);
    sort.forEach((item) => {
      let lastX;
      item.items.forEach((p) => {
        if (!lastX || p.x - lastX <= 15) {
          text += p.text;
        } else {
          text += ' ' + p.text;
        }
        lastX = p.x;
      });
      text += '\n';
    });
    return text;
  });
}
const isApproximatelyEqual = (y1, y2, tolerance = 5) => {
  return Math.abs(y1 - y2) <= tolerance;
};

const groupByLine = (items, tolerance = 5) => {
  const lines = [];

  items.forEach((item) => {
    const y = Math.round(item.transform[5]);
    const existingLine = lines.find((line) =>
      isApproximatelyEqual(line.y, y, tolerance),
    );

    if (existingLine) {
      existingLine.items.push({
        text: item.str,
        x: Math.round(item.transform[4]),
        y: Math.round(item.transform[5]),
      });
    } else {
      lines.push({
        y: y,
        items: [
          {
            text: item.str,
            x: Math.round(item.transform[4]),
            y: Math.round(item.transform[5]),
          },
        ],
      });
    }
  });

  lines.forEach((line) => {
    line.items.sort((a, b) => a.x - b.x);
  });
  return lines;
};
