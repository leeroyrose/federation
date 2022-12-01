import fs from 'fs';
import path from 'path';
import articles from './articles.json';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'apollo-server-express';

const typeDefs = gql(
  fs
    .readFileSync(path.resolve(__dirname, 'assets/article.graphql'))
    .toString('utf-8')
);

type Args = { id: string };

const resolvers = {
  Query: {
    article: (_: unknown, { id }: Args) => {
      const article = articles.find((article) => article.id === id);

      if (!article) {
        return {
          __typename: 'ArticleNotFound',
          message: `No article found with id: ${id}`,
        };
      }

      return {
        ...article,
        __typename: 'Article',
      };
    },
  },
  Article: {
    __resolveReference: ({ id }: Args) => {
      const article = articles.find((article) => article.id === id);

      return article || null;
    },
  },
};

export default buildSubgraphSchema([{ typeDefs, resolvers }]);
