const { GraphQLServer } = require("graphql-yoga");
const prisma = require("./src/prisma");
const cors = require("cors")


const typeDefs = `
  type Query {
    articles(query: String, search: String, first: Int, skip: Int, orderBy: ArticleOrderByInput): [Article]!
  }

  type Article {
    id: ID!
    site: String! 
    title: String!
    section: String!
    summary: String!
    image: String!
    content: String
    time: String!
    createdAt: String!
    updatedAt:String!
  }

  enum ArticleOrderByInput {
    id_ASC
    id_DESC
    site_ASC
    site_DESC
    title_ASC
    title_DESC
    section_ASC
    section_DESC
    summary_ASC
    summary_DESC
    image_ASC
    image_DESC
    content_ASC
    content_DESC
    time_ASC
    time_DESC
    createdAt_ASC
    createdAt_DESC
    updatedAt_ASC
    updatedAt_DESC
  }

  input ArticleWhereInput {    
    OR: [ArticleWhereInput!]
  }
`;

const resolvers = {
  Query: {
    articles: (parent, args, { prisma }, info) => {
      if (args) {
        return prisma.query.articles(
          {
            where: {
              AND: [
                { site_contains: args.query },
                {
                  OR: [
                    { title_contains: args.search },
                    { summary_contains: args.search },
                    { section_contains: args.search }
                  ]
                }
              ]
            },
            first: args.first,
            skip: args.skip,
            orderBy: args.orderBy
          },
          info
        );
      }

      // if (args.search) {
      //   return prisma.query.articles(
      //     {
      //       where: {
      //         OR: [
      //           { title_contains: args.search },
      //           { summary_contains: args.search },
      //           { section_contains: args.search }
      //         ]
      //       },
      //       first: args.first,
      //       skip: args.skip,
      //       orderBy: args.orderBy
      //     },
      //     info
      //   );
      // }

      //sadasdasdasdasd

      return prisma.query.articles({
        first: args.first,
        skip: args.skip,
        orderBy: args.orderBy
      });
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers, context: { prisma } });
const port = process.env.PORT || 4000;
server.start({port, cors:{origin: true} }, () => console.log(`Server is running on ${port}`));
