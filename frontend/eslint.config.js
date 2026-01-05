// frontend/eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react'; // Thêm plugin react cơ bản

export default [
  // Ignore thư mục build và các file không cần lint
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.{js,mjs,cjs}'],
  },

  // Config cơ bản cho tất cả file JS/JSX
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // Nếu cần dùng process.env trong config
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect', // Tự detect React version
      },
    },
    rules: {
      // Kế thừa recommended
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules, // Thêm React recommended

      // Rule cho React Refresh (tối ưu Vite HMR)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Một số rule phổ biến, dễ chịu cho dự án
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }], // Warn thay vì error, bỏ qua biến bắt đầu bằng _
      'react/jsx-uses-react': 'off',        // Không cần với JSX transform mới
      'react/react-in-jsx-scope': 'off',    // Không cần import React nữa
      'react/prop-types': 'off',            // Không dùng PropTypes (dùng TypeScript hoặc bỏ qua)
    },
  },
];