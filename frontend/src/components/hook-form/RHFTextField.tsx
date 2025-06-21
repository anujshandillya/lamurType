import { useFormContext, Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

type RHFTextFieldProps = {
  name: string;
  helperText: React.ReactNode;
};

export default function RHFTextField({ name, helperText, ...other }: RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <input
            className='w-full rounded-md border border-fg bg-bg px-2 py-1 text-sm font-normal text-fg placeholder:text-fg focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'
          placeholder="Type your message..."
          {...field}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          {...other}
        />
      )}
    />
  );
}
