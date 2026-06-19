import { getUsers } from './queries/get-users';
import { getTodoByUserId } from './queries/get-todos-by-user-id';

import { createUser } from './mutations/create-user';
import { deleteUser } from './mutations/delete-user';
import { createTodo } from './mutations/create-todo';
import { updateTodo } from './mutations/update-todo';
import { completeTodo } from './mutations/complete-todo';
import { uncompleteTodo } from './mutations/uncomplete-todo';
import { deleteTodo } from './mutations/delete-todo';

export const resolvers = {
  Query: {
    getUsers,
    getTodoByUserId,
  },
  Mutation: {
    createUser,
    deleteUser,
    createTodo,
    updateTodo,
    completeTodo,
    uncompleteTodo,
    deleteTodo,
  },
};
