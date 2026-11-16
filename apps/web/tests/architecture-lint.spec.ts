// @vitest-environment node
// ESLint loads configs and parsers through Node's module system; jsdom globals only get in its way.
import { ESLint } from 'eslint';
import { join, resolve } from 'node:path';

// Nx runs `eslint .` from the project root, so this resolves the same apps/web/eslint.config.mjs.
const projectRoot = resolve(import.meta.dirname, '..');
const viewPath = join(projectRoot, 'src/screens/Example/index.tsx');
const presenterPath = join(projectRoot, 'src/screens/Example/usePresenter.ts');

const eslint = new ESLint({ cwd: projectRoot });

async function ruleIds(code: string, filePath: string) {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((message) => message.ruleId);
}

function view(body: string, imports = '') {
  return `${imports}
export function Example() {
${body}
  return <p>{String(value)}</p>;
}
`;
}

describe('architecture lint', () => {
  it('rejects useState in a View', async () => {
    const code = view(
      '  const [value] = useState(0);',
      "import { useState } from 'react';",
    );

    expect(await ruleIds(code, viewPath)).toContain('no-restricted-syntax');
  });

  it('rejects a member hook call in a View', async () => {
    const code = view(
      '  React.useEffect(() => undefined, []);\n  const value = 1;',
      "import React from 'react';",
    );

    expect(await ruleIds(code, viewPath)).toContain('no-restricted-syntax');
  });

  it('allows usePresenter and useTranslation in a View', async () => {
    const code = view(
      '  const { value } = usePresenter();\n  useTranslation();',
      "import { usePresenter } from './usePresenter';\nimport { useTranslation } from 'react-i18next';",
    );

    expect(await ruleIds(code, viewPath)).toEqual([]);
  });

  it('ignores functions that only start with lowercase "use"', async () => {
    const code = view(
      '  const value = useful(user());',
      "import { useful, user } from './lib';",
    );

    expect(await ruleIds(code, viewPath)).toEqual([]);
  });

  it('allows hooks outside a View', async () => {
    const code = `import { useState } from 'react';

export function usePresenter() {
  const [value] = useState(0);
  return { value };
}
`;

    expect(await ruleIds(code, presenterPath)).not.toContain(
      'no-restricted-syntax',
    );
  });

  it('rejects a file longer than 120 lines of code', async () => {
    const code = Array.from(
      { length: 121 },
      (_, index) => `export const value${index} = ${index};`,
    ).join('\n');

    expect(await ruleIds(code, presenterPath)).toContain('max-lines');
  });
});
