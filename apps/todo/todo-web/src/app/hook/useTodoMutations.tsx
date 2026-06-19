'use client';

import { useMutation } from '@apollo/client/react';
import {
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  COMPLETE_TODO,
  UNCOMPLETE_TODO,
} from '../graphql/todo';
import { GET_USERS } from '../graphql/user';

interface Todo {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  isCompleted: boolean;
}

export const useTodoMutations = (userId: string) => {
  const [createTodoMutation, { loading: addLoading }] = useMutation(
    CREATE_TODO,
    {
      refetchQueries: [{ query: GET_USERS }],
    },
  );
  const [updateTodoMutation, { loading: updateLoading }] = useMutation(
    UPDATE_TODO,
    {
      refetchQueries: [{ query: GET_USERS }],
    },
  );
  const [completeTodoMutation] = useMutation(COMPLETE_TODO, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [uncompleteTodoMutation] = useMutation(UNCOMPLETE_TODO, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const [deleteTodoMutation] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleFormSubmit = async (
    editingTodo: Todo | null,
    formData: { title: string; description: string; xpReward: number },
    onSuccess: () => void,
  ) => {
    try {
      if (editingTodo) {
        await updateTodoMutation({
          variables: {
            todoId: editingTodo.id,
            input: {
              title: formData.title,
              description: formData.description,
              xpReward: Number(formData.xpReward),
              userId,
            },
          },
        });
      } else {
        await createTodoMutation({
          variables: {
            input: {
              title: formData.title,
              description: formData.description,
              xpReward: Number(formData.xpReward),
              userId,
            },
          },
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (todoId: string, isCompleted: boolean) => {
    try {
      if (!isCompleted) {
        await completeTodoMutation({ variables: { todoId, userId } });
      } else {
        await uncompleteTodoMutation({ variables: { todoId, userId } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await deleteTodoMutation({ variables: { todoId } });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    loading: addLoading || updateLoading,
    handleFormSubmit,
    handleToggleTodo,
    handleDeleteTodo,
  };
};
