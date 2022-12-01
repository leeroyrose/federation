import { ApolloGateway } from '@apollo/gateway';
import { articleSchema, carSchema, createServer, searchSchema } from './graphs';
import fs from 'fs';
import path from 'path';

const supergraphSdl = fs
  .readFileSync(path.resolve('supergraph.graphql'))
  .toString('utf-8');

const gateway = new ApolloGateway({
  supergraphSdl,
});

const services = [
  {
    name: 'Gateway',
    port: 7000,
    gateway,
  },
  {
    name: 'Article',
    port: 7001,
    schema: articleSchema,
  },
  {
    name: 'Car',
    port: 7002,
    schema: carSchema,
  },
  {
    name: 'Search',
    port: 7003,
    schema: searchSchema,
  },
];

Promise.all(services.map(createServer)).then((server) =>
  server.map((server) => server.listen())
);
