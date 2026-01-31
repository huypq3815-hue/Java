/**
 * Form Validation Utils
 */

// Validate Email
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate Password (min 6 chars, at least 1 number)
export const validatePassword = (password) => {
    if (password.length < 6) return false;
    if (!/\d/.test(password)) return false;
    return true;
};

// Validate Password Strength
export const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 1) return { level: 'weak', color: 'red', text: 'Yếu' };
    if (strength <= 2) return { level: 'normal', color: 'orange', text: 'Bình thường' };
    if (strength <= 3) return { level: 'strong', color: 'blue', text: 'Mạnh' };
    return { level: 'veryStrong', color: 'green', text: 'Rất mạnh' };
};

// Validate Username
export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
};

// Validate Full Name
export const validateFullName = (fullName) => {
    return fullName && fullName.trim().length >= 2;
};

// Required field validation
export const isRequired = (value) => {
    return value && value.toString().trim().length > 0;
};
