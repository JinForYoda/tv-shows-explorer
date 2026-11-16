import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

// React 19's bare `use` is a hook too; `^use[A-Z]` alone would let it through.
const hookName = '/^use($|[A-Z])/';
const allowedViewHook = '/^(usePresenter|useTranslation)$/';
const viewHookMessage =
  'A View calls only usePresenter and useTranslation; move any other hook into the presenter (docs/simple-architecture.md, rule 1).';

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['src/screens/**/index.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `CallExpression[callee.name=${hookName}]:not([callee.name=${allowedViewHook}])`,
          message: viewHookMessage,
        },
        {
          selector: `CallExpression[callee.property.name=${hookName}]:not([callee.property.name=${allowedViewHook}])`,
          message: viewHookMessage,
        },
      ],
    },
  },
];
