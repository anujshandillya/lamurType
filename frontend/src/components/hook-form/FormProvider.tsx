import {FormProvider as Form} from 'react-hook-form';
import type {UseFormReturn, FieldValues} from 'react-hook-form';

type FormProviderProps<TFieldValues extends FieldValues = FieldValues, TContext = any> = {
    children: React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    methods: UseFormReturn<TFieldValues, TContext>;
}

export default function FormProvider<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>({ 
  children, 
  onSubmit, 
  methods 
}: FormProviderProps<TFieldValues, TContext>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}