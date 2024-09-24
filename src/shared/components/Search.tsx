import { TextField } from '@mui/material';
import { KeyboardEvent, forwardRef } from 'react';

interface SearchProps {
  placeholder?: string;
  onSearch: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Search = forwardRef(function ({ placeholder = '', onSearch }: SearchProps, ref) {
  return (
    <TextField
      inputRef={ref}
      hiddenLabel
      fullWidth
      id="filled-hidden-label-small"
      size="small"
      placeholder={placeholder}
      variant="standard"
      onKeyUp={onSearch}
    />
  );
});
