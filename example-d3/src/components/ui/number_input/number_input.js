import { TextField } from '@mui/material';

export default function NumberInputBasic({ value, onChange }) {
  return (
    <TextField
      label="How many people are travelling?"
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      inputProps={{ min: 1 }}
    />
  );
}
