import { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

type TData = {
  message: string;
};

type CreateUserData = {
  createUser: TData;
};

type TVariables = {
  name: string;
  xp: number;
};

type CreateUserVariables = {
  input: TVariables;
};

export const CREATE_USER: TypedDocumentNode<
  CreateUserData,
  CreateUserVariables
> = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      message
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      name
      level
      id
      xp
      todos {
        id
        title
        description
        xpReward
        isCompleted
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      message
    }
  }
`;
