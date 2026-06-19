import gql from 'graphql-tag';

export const CREATE_USER = gql`
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
