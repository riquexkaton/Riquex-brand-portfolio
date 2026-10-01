import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import boundaries from 'eslint-plugin-boundaries';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { MAX_FILE_LINES } from './quality.config.js';

// Architecture layers (screaming + atomic). Every file under src/ must belong to one of them.
const LAYERS = ['pages', 'layouts', 'ui', 'data', 'motion', 'styles', 'assets'];
const elements = [
  ...LAYERS.map((layer) => ({ type: layer, pattern: `src/${layer}`, partialMatch: false })),
  { type: 'features', pattern: 'src/features/*', capture: ['feature'], partialMatch: false },
];
const allow = (from, to) => ({ from: { element: { type: from } }, allow: { to: { element: { type: to } } } });
const motionLibraries = { regex: '^(gsap|lenis)(/|$)', message: 'Import gsap/lenis only inside src/motion.' };

export default defineConfig(
  // .wrangler/ holds wrangler dev's generated bundles (it's gitignored, but ESLint doesn't read .gitignore).
  globalIgnores(['dist/', '.astro/', '.wrangler/', 'node_modules/']),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  astro.configs.recommended,
  astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: {
      parserOptions: { projectService: true, extraFileExtensions: ['.astro'] },
    },
    rules: {
      'max-lines': ['error', { max: MAX_FILE_LINES, skipBlankLines: false, skipComments: false }],
      'max-lines-per-function': ['error', { max: 60 }],
      complexity: ['error', 8],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],
      'max-nested-callbacks': ['error', 3],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // The carousel is a keyboard-operable region (arrow keys), so it must be focusable.
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['tabpanel', 'region'] }],
    },
  },
  {
    // Type information is only reliable for .ts files: astro-eslint-parser's virtual TSX (and its
    // client <script> blocks) yields false positives, and plain JS config files carry no types.
    files: ['**/*.astro', '**/*.astro/*.ts', '**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['*.{js,ts}', 'scripts/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.{ts,astro}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
      'boundaries/elements': elements,
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            ...['layouts', 'features'].map((to) => allow('pages', to)),
            ...['ui', 'data', 'motion', 'styles', 'assets'].map((to) => allow('layouts', to)),
            ...['ui', 'data', 'motion', 'assets'].map((to) => allow('features', to)),
            {
              from: { element: { type: 'features' } },
              allow: {
                to: { element: { type: 'features', captured: { feature: '{{from.element.captured.feature}}' } } },
              },
            },
            allow('ui', 'ui'),
            allow('data', 'assets'),
            // Data modules may share types (e.g. `Link`), never values.
            {
              from: { element: { type: 'data' } },
              allow: { to: { element: { type: 'data' } }, dependency: { kind: 'type' } },
            },
            allow('motion', 'motion'),
          ],
        },
      ],
    },
  },
  {
    // GSAP and Lenis stay behind the motion runtime (features use onMotionReady).
    files: ['src/**/*.{ts,astro}'],
    ignores: ['src/motion/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [motionLibraries] }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportExpression[source.value=/^(gsap|lenis)(\\u002F|$)/]',
          message: 'Import gsap/lenis only inside src/motion.',
        },
      ],
    },
  },
  {
    // <script> blocks are linted as virtual files (Foo.astro/0_0.ts), so `../` paths cannot be resolved
    // by boundaries. Forbid them: cross-folder imports must use the `@/` alias, which boundaries checks.
    files: ['src/**/*.astro/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [motionLibraries, { regex: '^\\.\\./', message: 'Use ./ or @/ imports in <script> blocks.' }] },
      ],
    },
  },
);
