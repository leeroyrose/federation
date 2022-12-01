import fs from 'fs';
import path from 'path';
import searchHappy from './search-happy.json';
import searchSad from './search-sad.json';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'apollo-server-express';

const typeDefs = gql(
  fs
    .readFileSync(path.resolve(__dirname, 'assets/search.graphql'))
    .toString('utf-8')
);

type Args = {
  term: string;
};

const resolvers = {
  Query: {
    search: (_: unknown, { term }: Args) => {
      if (term === 'error') {
        return {
          __typename: 'SearchError',
          message: 'Forced error for testing',
        };
      }

      if (term === 'sad') {
        return {
          total: searchSad.length,
          items: searchSad,
          __typename: 'SearchSuccess',
        };
      }

      return {
        total: searchHappy.length,
        items: searchHappy,
        __typename: 'SearchSuccess',
      };
    },
  },
  SearchResults: {
    __resolveType: (obj: { type: string }) => obj.type,
  },
};

export default buildSubgraphSchema([{ typeDefs, resolvers }]);
