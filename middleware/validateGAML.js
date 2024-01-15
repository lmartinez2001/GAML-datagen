const validateGAML = (req, res, next) => {
  const promptAnswer = req.body?.variables?.input?.answer

  if (!promptAnswer) {
    next()
  } else {
    const regex = /\[code\]([\s\S]*?)\[\/code\]/g
    const results = []
    var match

    while ((match = regex.exec(promptAnswer)) !== null) {
      results.push(match[1])
    }

    if (results.length > 0) {
      console.log('All code snippets', results)
    } else {
      console.log('No code in the answer')
    }

    next()
  }
}

module.exports = validateGAML
