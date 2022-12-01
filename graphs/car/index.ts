import fs from 'fs';
import path from 'path';
import cars from './cars.json';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'apollo-server-express';

const typeDefs = gql(
  fs
    .readFileSync(path.resolve(__dirname, 'assets/car.graphql'))
    .toString('utf-8')
);

type Args = { id: string };

const resolvers = {
  Query: {
    car: (_: unknown, { id }: Args) => {
      const car = cars.find((car) => car.id === id);

      if (!car) {
        return {
          __typename: 'CarNotFound',
          message: `No car found with id: ${id}`,
        };
      }

      return {
        ...car,
        __typename: 'Car',
      };
    },
  },
  Car: {
    __resolveReference: ({ id }: Args) => {
      const car = cars.find((car) => car.id === id);

      return car || null;
    },
  },
};

export default buildSubgraphSchema([{ typeDefs, resolvers }]);
