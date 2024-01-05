const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const promptsResolver = {
  Query: {
    async prompts(_, args, context, info) {
      return await prisma.prompt.findMany()
    },

    async prompt(_, args, context, info) {
      const id = args.id
      return await prisma.prompt.findUnique({ where: { id } })
    },
  },
  Mutation: {
    async createPrompt(_, args) {
      const { question, answer } = args.input
      const createdPrompt = await prisma.prompt.create({
        data: {
          question,
          answer,
        },
      })

      return createdPrompt
    },

    async deletePrompt(_, args) {
      const id = args.id
      const deletedPrompt = await prisma.prompt.delete({ where: { id } })
      return deletedPrompt
    },
  },
}

module.exports = { promptsResolver }
