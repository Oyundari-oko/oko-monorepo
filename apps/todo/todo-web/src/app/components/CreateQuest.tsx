'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input, Button } from '@oko-monorepo/shadcn';

const questFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Гарчиг хамгийн багадаа 3 тэмдэгт байх ёстой.')
    .max(50, 'Гарчиг хамгийн ихдээ 50 тэмдэгт байх ёстой.')
    .refine((val) => val.trim() !== '', 'Гарчиг хоосон байж болохгүй.'),
  description: z
    .string()
    .min(5, 'Тайлбар хамгийн багадаа 5 тэмдэгт байх ёстой.')
    .max(200, 'Тайлбар хамгийн ихдээ 200 тэмдэгт байх ёстой.'),
});

type QuestFormValues = z.infer<typeof questFormSchema>;

interface CreateQuestFormProps {
  onSubmit: (data: QuestFormValues & { xpReward: number }) => void;
  loading: boolean;
  initialData?: Partial<QuestFormValues & { xpReward: number }>;
}

export const CreateQuestForm = ({
  onSubmit,
  loading,
  initialData,
}: CreateQuestFormProps) => {
  const isEditing = !!initialData?.title;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
  });

  const handleLocalSubmit = (values: QuestFormValues) => {
    onSubmit({
      ...values,
      xpReward: initialData?.xpReward || 100,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleLocalSubmit)}
      className="space-y-4 font-sans text-stone-700"
    >
      <div className="text-center pb-2">
        <h3 className="text-base font-black text-stone-800">
          {isEditing ? 'Даалгавар засах' : 'Шинэ даалгавар нэмэх'}
        </h3>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-stone-400 uppercase">
          Гарчиг
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="rounded-xl border-stone-200/60 h-10 text-xs"
            />
          )}
        />
        {errors.title && (
          <p className="text-[11px] font-medium text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-stone-400 uppercase">
          Тайлбар
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="rounded-xl border-stone-200/60 h-10 text-xs"
            />
          )}
        />
        {errors.description && (
          <p className="text-[11px] font-medium text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl mt-2 cursor-pointer text-xs"
      >
        {loading
          ? 'Уншиж байна...'
          : isEditing
            ? 'Хадгалах'
            : 'Даалгавар үүсгэх'}
      </Button>
    </form>
  );
};
