import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($input: TodoInput!) {
    createTodo(input: $input) {
      message
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation Mutation($todoId: ID!, $input: TodoInput!) {
    updateTodo(todoId: $todoId, input: $input) {
      description
      id
      isCompleted
      title
      userId
      xpReward
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($todoId: ID!) {
    deleteTodo(todoId: $todoId) {
      id
      message
    }
  }
`;

export const COMPLETE_TODO = gql`
  mutation CompleteTodo($todoId: ID!, $userId: ID!) {
    completeTodo(todoId: $todoId, userId: $userId) {
      leveledUp
      message
      newLevel
      newXp
      xpGained
    }
  }
`;

export const UNCOMPLETE_TODO = gql`
  mutation UncompleteTodo($todoId: ID!, $userId: ID!) {
    uncompleteTodo(todoId: $todoId, userId: $userId) {
      leveledUp
      message
      newLevel
      newXp
      xpGained
    }
  }
`;
