import express from 'express';
import http from 'http';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import { ApolloGateway } from '@apollo/gateway';

type Config = {
  name: string;
  port: number;
  schema?: GraphQLSchema;
  gateway?: ApolloGateway;
};

export default async (config: Config) => {
  const { name, schema, gateway, port } = config;
  const server = new ApolloServer({
    schema,
    gateway,
    persistedQueries: false,
    plugins: [ApolloServerPluginInlineTrace()],
  });

  const app = express();
  const httpServer = http.createServer(app);

  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
  });

  httpServer.on('listening', () => {
    console.info(`${name} listening at http://localhost:${port}`);
  });

  return {
    listen: () => httpServer.listen(port),
    close: httpServer.close,
  };
};
