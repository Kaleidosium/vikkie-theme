import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { auditTheme, contrast } from './audit.mjs';

const themes = ['dark', 'light'].map((type) => JSON.parse(readFileSync(
  new URL(`../themes/vikkie-color-theme-${type}.json`, import.meta.url), 'utf8',
)));

test('WCAG contrast includes foreground and background alpha compositing', () => {
  assert.equal(contrast('#000000', '#FFFFFF'), 21);
  assert.equal(contrast('#FFFFFF', '#000000'), 21);
  assert.equal(contrast('#FFFFFF', '#FFFFFF'), 1);
  assert.equal(contrast('#00000000', '#FFFFFF'), 1);
  assert.equal(contrast('#00000080', '#FFFFFF'), contrast('#7F7F7F', '#FFFFFF'));
  assert.equal(contrast('#FFFFFF', '#00000080', '#FFFFFF'), contrast('#FFFFFF', '#7F7F7F'));
  assert.throws(() => contrast('#INVALID', '#FFFFFF'), /Invalid color/);
});

test('CLI audits the theme JSON from another working directory', () => {
  const script = fileURLToPath(new URL('./audit.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [script], { cwd: tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  for (const theme of themes) assert.ok(result.stdout.includes(`${theme.name}: PASS`));
});

for (const source of themes) {
  test(`${source.type}: checked-in theme passes the audit`, () => auditTheme(source));

  for (const [name, mutate, expected] of [
    ['unsupported theme variants', (theme) => {
      theme.type = 'sepia';
    }, /Unknown theme variant/],
    ['low contrast syntax', (theme) => {
      theme.tokenColors[0].settings.foreground = theme.colors['editor.background'];
    }, /Comments contrast/],
    ['low contrast semantic tokens', (theme) => {
      theme.semanticTokenColors.function = theme.colors['editor.background'];
    }, /semantic token function contrast/],
    ['low contrast terminal colors', (theme) => {
      theme.colors['terminal.ansiRed'] = theme.colors['editor.background'];
    }, /terminal\.ansiRed contrast/],
    ['invisible focus rings', (theme) => {
      theme.colors.focusBorder = theme.colors['editor.background'];
    }, /focus ring/],
    ['invisible control borders', (theme) => {
      theme.colors['input.border'] = theme.colors['input.background'];
    }, /input border/],
    ['a second UI accent', (theme) => {
      theme.colors['badge.background'] = theme.colors['terminal.ansiGreen'];
    }, /badge.background must use the UI accent/],
    ['non-repeating brackets', (theme) => {
      theme.colors['editorBracketHighlight.foreground4'] = theme.colors['editorBracketHighlight.foreground2'];
    }, /Bracket tints must repeat/],
    ['comments without italics', (theme) => {
      theme.tokenColors.find(({ name }) => name === 'Comments').settings.fontStyle = '';
    }, /Comments must stay italic/],
    ['indistinguishable syntax colors', (theme) => {
      theme.tokenColors.find(({ name }) => name === 'Comments').settings.foreground = theme.semanticTokenColors.function;
    }, /protanopia separation/],
  ]) {
    test(`${source.type}: audit rejects ${name}`, () => {
      const theme = structuredClone(source);
      mutate(theme);
      assert.throws(() => auditTheme(theme), expected);
    });
  }
}
