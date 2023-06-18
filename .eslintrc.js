module.exports = {
  env: {
    browser: true,
    node: true
  },
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@next/next/recommended', 'next/core-web-vitals', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'import', 'unused-imports'],
  rules: {
    '@next/next/no-img-element': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['error', {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_'
    }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': ['error', {
      types: {
        '{}': {
          fixWith: 'object',
          message: 'Use Record<string, unknown> or EmptyObject instead'
        },
        object: {
          fixWith: 'object',
          message: 'Use Record<string, unknown> or EmptyObject instead'
        }
      }
    }],
    'import/order': ['error', {
      alphabetize: {
        caseInsensitive: true,
        order: 'asc'
      },
      groups: ['builtin', 'external', 'internal', 'index', 'type', 'sibling', 'parent'],
      'newlines-between': 'always',
      pathGroups: [{
        group: 'internal',
        pattern: 'src/components/**',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/constants',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/hooks/**',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/lib/**',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/provider/**',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/stores/**',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/styles/**',
        position: 'before'
      }, {
        group: 'internal',
        pattern: 'src/utils/**',
        position: 'before'
      }]
    }]
  },
  overrides: [{
    files: ['*.stories.tsx', 'src/pages/**/*'],
    rules: {
      'import/no-default-export': 'off'
    }
  }],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      },
      typescript: {
        alwaysTryTypes: true,
        config: 'tsconfig.json'
      }
    },
    react: {
      version: 'detect' // React version. "detect" automatically picks the version you have installed.
    }
  }
};