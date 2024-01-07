require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { typeDefs, resolvers } = require('./graphql/index')

const app = express()
const PORT = process.env.APP_PORT || 80

const bootstrapServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await server.start()
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/graphql', expressMiddleware(server))

  app.get('/', (req, res) => {
    res.send('Hello World')
  })

  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
    console.log(`Graphql started at http://localhost:${PORT}/graphql`)
  })
}

bootstrapServer()
