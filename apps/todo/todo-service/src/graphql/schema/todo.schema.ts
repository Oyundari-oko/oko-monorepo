import { gql } from 'graphql-tag';
export const typeTodoDefs = gql`
  type Todo {
    id: ID!
    title: String!
    description: String
    xpReward: Int!
    isCompleted: Boolean!
    userId: ID!
  }

  type DeleteTodoResponse {
    id: ID!
    message: String!
  }

  type CompleteTodoResponse {
    message: String!
    xpGained: Int!
    leveledUp: Boolean!
    newLevel: Int!
    newXp: Int!
  }

  input TodoInput {
    title: String!
    description: String
    xpReward: Int!
    userId: ID!
  }

  type Mutation {
    createUser(input: UserInput!): Response!
    deleteUser(id: ID!): Response!
    createTodo(input: TodoInput!): Response!
    updateTodo(todoId: ID!, input: TodoInput!): Todo!
    completeTodo(todoId: ID!, userId: ID!): CompleteTodoResponse!
    uncompleteTodo(todoId: ID!, userId: ID!): CompleteTodoResponse!
    deleteTodo(todoId: ID!): DeleteTodoResponse!
  }

  type Response {
    message: String!
  }
`;
