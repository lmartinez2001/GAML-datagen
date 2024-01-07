const path = require('path')
const { readFileSync } = require('fs')
const { promptsResolver } = require('./resolvers/prompt.resolver')

const promptTypes = readFileSync(
  path.join(__dirname, './typeDefs/prompt.graphql'),
  {
    encoding: 'utf-8',
  }
)

const typeDefs = `
    ${promptTypes}
`

const resolvers = {
  Query: {
    ...promptsResolver.Query,
  },
  Mutation: {
    ...promptsResolver.Mutation,
  },
}

module.exports = { typeDefs, resolvers }
