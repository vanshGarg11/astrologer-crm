const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

const validators = {
  email: (value, fieldName = 'email') => {
    if (!value) return `${fieldName} is required.`;
    if (!validateEmail(value)) return `${fieldName} must be a valid email address.`;
    return null;
  },

  phone: (value, fieldName = 'phone') => {
    if (!value) return `${fieldName} is required.`;
    if (!validatePhone(value)) return `${fieldName} must be exactly 10 digits.`;
    return null;
  },

  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required.`;
    }
    return null;
  },

  minLength: (value, min, fieldName) => {
    if (value && String(value).length < min) {
      return `${fieldName} must be at least ${min} characters.`;
    }
    return null;
  },

  number: (value, fieldName) => {
    if (value !== undefined && value !== null && (isNaN(value) || value === '')) {
      return `${fieldName} must be a number.`;
    }
    return null;
  },

  numberRange: (value, min, max, fieldName) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      return `${fieldName} must be between ${min} and ${max}.`;
    }
    return null;
  },

  date: (value, fieldName) => {
    if (value && isNaN(new Date(value).getTime())) {
      return `${fieldName} must be a valid date.`;
    }
    return null;
  },
};

const validate = (data, rules) => {
  const errors = {};
  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];
    let error = null;

    if (typeof rule === 'function') {
      error = rule(value);
    } else if (Array.isArray(rule)) {
      for (const validator of rule) {
        error = validator(value);
        if (error) break;
      }
    }

    if (error) errors[field] = error;
  });
  return errors;
};

module.exports = { validators, validate, validateEmail, validatePhone };
