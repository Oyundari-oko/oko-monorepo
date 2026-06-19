import { gql } from 'graphql-tag';
export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    xp: Int!
    level: Int!
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    title: String!
    description: String
    xpReward: Int!
    isCompleted: Boolean!
  }

  input TodoInput {
    title: String!
    description: String
    xpReward: Int!
  }

  input UserInput {
    name: String!
    xp: Int!
  }

  type Response {
    message: String!
  }

  type Query {
    getUsers: [User]!
    getTodoByUserId(userId: ID!): [Todo]!
  }

  type Mutation {
    createUser(input: UserInput!): Response!
    deleteUser(id: ID!): Response!
  }
`;
