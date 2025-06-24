// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "/api/graphql", // URL endpoint GraphQL Anda
    cache: new InMemoryCache(),
});

export default client;