'use client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider as Provider } from '@apollo/client/react';

const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4001/graphql';

const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});

export const ApolloProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider client={client}>{children}</Provider>;
};