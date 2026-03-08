export function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

export function insertSvg(container, svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.nodeName === 'svg') {
    container.appendChild(document.importNode(svg, true));
  }
}
