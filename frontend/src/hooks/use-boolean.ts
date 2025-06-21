import { useState } from 'react';

export function useBoolean(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const onTrue = () => setValue(true);
  const onFalse = () => setValue(false);
  const toggle = () => setValue((prev) => !prev);

  return { value, onTrue, onFalse, toggle };
}