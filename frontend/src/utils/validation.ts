import { FormErrors } from '../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

export function validateRequired(values: Record<string, unknown>, fields: string[]) {
  const errors: FormErrors = {};
  fields.forEach((field) => {
    if (!values[field]) errors[field] = 'This field is required.';
  });
  return errors;
}

export function validateEmailPhone(values: { email?: string; phone?: string }, errors: FormErrors) {
  if (values.email && !emailRegex.test(values.email)) errors.email = 'Enter a valid email.';
  if (values.phone && !phoneRegex.test(values.phone)) errors.phone = 'Phone must be 10 digits.';
}

export function mergeErrors(...items: FormErrors[]) {
  return Object.assign({}, ...items);
}
