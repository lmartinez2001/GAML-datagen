const mdContent = new Request('README.md')

const getSvg = async (path) => {
  const response = await fetch(path)
  const svgContent = await response.text()
  return svgContent
}

const alertComponent = async (alertType, title, content) => {
  const svg = await getSvg(`./svg/${title.toLowerCase()}.svg`)
  return `<div class="md-alert md-alert-${alertType}">
    <p class="md-alert-title">${svg}${title}</p>
    <p>${content}</p>
  </div>`
}

const replaceBlockquoteWithAlert = async (blockquote, title, text) => {
  const alertType = title.toLowerCase()
  const content = text
    .replace(/\[!NOTE\]|\[!TIP\]|\[!WARNING\]|\[!IMPORTANT\]|\[!CAUTION\]/, '')
    .trim()
  const alertHtml = await alertComponent(alertType, title, content)
  blockquote.outerHTML = alertHtml
}

fetch(mdContent)
  .then((data) => data.text())
  .then((text) => {
    instructionsText.innerHTML = marked.parse(text)

    // Handling blockquotes
    const blockquotes = instructionsText.querySelectorAll('blockquote')

    blockquotes.forEach((blockquote) => {
      const pElement = blockquote.querySelector('p')
      const text = pElement.textContent

      if (text.startsWith('[!NOTE]')) {
        replaceBlockquoteWithAlert(blockquote, 'Note', text)
      } else if (text.startsWith('[!TIP]')) {
        replaceBlockquoteWithAlert(blockquote, 'Tip', text)
      } else if (text.startsWith('[!WARNING]')) {
        replaceBlockquoteWithAlert(blockquote, 'Warning', text)
      } else if (text.startsWith('[!IMPORTANT]')) {
        replaceBlockquoteWithAlert(blockquote, 'Important', text)
      } else if (text.startsWith('[!CAUTION]')) {
        replaceBlockquoteWithAlert(blockquote, 'Caution', text)
      }
    })
  })
