import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './resolvers';

/** 
  * Load GraphQL SDL from the local schema file. * This keeps the schema in a separate, readable .graphql file. 
  */
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');

/**
 * Build an executable schema by combining typeDefs and resolvers.
 * Useful for custom schema assembly, stitching, or directive wiring later.
 */
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/**
 * Starts an Apollo Server (standalone) with the compiled schema.
 *
 * Behavior:
 * - Enables CSRF prevention and a bounded in-memory cache (safe defaults).
 * - Uses PORT from environment or falls back to 4000.
 * - Starts the standalone HTTP server and logs the GraphQL endpoint URL.
 *
 * @throws Will propagate errors that occur during startup.
 */

async function start() {
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
  });

  /* Prefer env PORT for deployment; default to 4000 for local development */
  const port = Number(process.env.PORT) || 4000;

  /* Start the server and listen on the configured port */
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`GraphQL ready at ${url}`);
}

/* Bootstrap with top-level error handling for clean exit signal */
start().catch((err) => {
  console.error('Failed to start Apollo Server', err);
  process.exit(1);
});