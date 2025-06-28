import { usePreferenceContext } from '@/context/Preference/PreferenceContext';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input';

// ----------------------------------------------------------------------

type RHFTextFieldProps = {
  name: string;
  helperText?: React.ReactNode;
  label?: string;
  type?: string;
  fullWidth?: boolean;
};

export default function RHFTextField({ name, helperText, label, type = "text", fullWidth = true, ...other }: RHFTextFieldProps) {
  const { control } = useFormContext();
  const { preferences: { theme } } = usePreferenceContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          <Input
            className={`${fullWidth ? 'w-full' : 'w-auto'} rounded-lg border border-fg/20 bg-${theme}-bg/50 backdrop-blur-sm px-4 py-3 text-sm font-normal text-${theme}-fg placeholder:text-${theme}-hl/60 focus:border-fg/40 focus:outline-none focus:ring-2 focus:ring-fg/20 transition-all duration-200`}
            placeholder={label}
            type={type}
            {...field}
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            {...other}
          />
          {error && (
            <p className="text-xs text-red-500/80">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
