import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  blend, clampRgb, converter, differenceEuclidean,
  filterDeficiencyProt, filterDeficiencyDeuter, filterDeficiencyTrit,
  parse, wcagContrast,
} from 'culori';

function color(hex) {
  assert.match(hex, /^#[\da-f]{6}([\da-f]{2})?$/i, `Invalid color: ${hex}`);
  return parse(hex);
}

export function contrast(foreground, background, base = '#FFFFFF') {
  const bg = blend([color(base), color(background)]);
  return wcagContrast(blend([bg, color(foreground)]), bg);
}

const toLinear = converter('lrgb');
const difference = differenceEuclidean('oklab');
const simulations = {
  protanopia: filterDeficiencyProt(),
  deuteranopia: filterDeficiencyDeuter(),
  tritanopia: filterDeficiencyTrit(),
};

export function auditTheme(theme) {
  const { colors, tokenColors, semanticTokenColors } = theme;
  assert.ok(theme.type === 'dark' || theme.type === 'light', 'Unknown theme variant');
  assert.equal(theme.semanticHighlighting, true, 'Semantic highlighting must be enabled');
  for (const value of Object.values(colors)) color(value);
  const editor = colors['editor.background'];
  const surface = colors['sideBar.background'];
  const panel = colors['panel.background'];
  const check = (foreground, background, minimum, label, base) => {
    const ratio = contrast(foreground, background, base);
    assert.ok(ratio >= minimum, `${theme.name}: ${label} contrast ${ratio.toFixed(2)}:1 < ${minimum}:1`);
    return ratio;
  };

  for (const key of ['editor.background', 'sideBar.background', 'panel.background', 'activityBar.background', 'editorWidget.background']) {
    check(colors.foreground, colors[key], 4.5, `body text on ${key}`);
    check(colors.focusBorder, colors[key], 3, `focus ring on ${key}`);
  }
  for (const key of ['editor.background', 'sideBar.background', 'editorWidget.background']) {
    check(colors.descriptionForeground, colors[key], 4.5, `secondary text on ${key}`);
  }
  for (const [foreground, background] of [
    ['input.foreground', 'input.background'],
    ['button.foreground', 'button.background'],
    ['button.secondaryForeground', 'button.secondaryBackground'],
    ['terminal.foreground', 'panel.background'],
  ]) check(colors[foreground], colors[background], 4.5, foreground);

  for (const control of ['input', 'checkbox', 'dropdown']) {
    for (const background of [colors[`${control}.background`], surface, editor]) {
      check(colors[`${control}.border`], background, 3, `${control} border`);
    }
  }
  check(colors.focusBorder, colors['list.activeSelectionBackground'], 3, 'focus ring on selected row', surface);
  check(colors.focusBorder, colors['editorSuggestWidget.selectedBackground'], 3, 'focus ring on selected suggestion', colors['editorSuggestWidget.background']);

  for (const key of [
    'badge.background', 'activityBarBadge.background', 'panelTitleBadge.background',
    'profileBadge.background', 'extensionBadge.remoteBackground', 'extensionButton.background',
    'extensionButton.prominentBackground', 'chat.avatarBackground', 'agentsBadge.background',
    'agentsUnreadBadge.background', 'inlineEdit.gutterIndicator.primaryBackground',
    'testing.coverCountBadgeBackground',
  ]) assert.equal(colors[key], colors['button.background'], `${key} must use the UI accent`);
  for (const key of ['tab.activeBorderTop', 'activityBar.activeBorder', 'terminal.tab.activeBorder']) {
    assert.equal(colors[key], colors['editorCursor.foreground'], `${key} must use the accent line color`);
  }
  for (const key of ['textLink.foreground', 'list.focusOutline', 'list.focusAndSelectionOutline', 'inlineChatInput.focusBorder', 'agentsChatInput.focusBorder']) {
    assert.equal(colors[key], colors.focusBorder, `${key} must use the focus accent`);
  }

  const brackets = Array.from({ length: 6 }, (_, i) => colors[`editorBracketHighlight.foreground${i + 1}`]);
  assert.equal(new Set(brackets.slice(0, 3)).size, 3, 'Bracket colors must have three distinct tints');
  assert.deepEqual(brackets.slice(3), brackets.slice(0, 3), 'Bracket tints must repeat');
  for (const [i, color] of brackets.entries()) {
    check(color, editor, 4.5, `bracket ${i + 1}`);
    assert.equal(colors[`editorBracketPairGuide.activeBackground${i + 1}`], `${color}99`, 'Bracket guides must match their tint');
  }

  const syntax = tokenColors.filter(({ settings }) => settings.foreground).map(({ name, settings }) =>
    check(settings.foreground, settings.background ?? editor, 4.5, name, editor));
  assert.ok(syntax.length > 0, 'Syntax colors are missing');
  for (const [name, settings] of Object.entries(semanticTokenColors)) {
    const foreground = typeof settings === 'string' ? settings : settings.foreground;
    if (foreground) check(foreground, editor, 4.5, `semantic token ${name}`);
  }
  const rule = (name) => {
    const token = tokenColors.find((token) => token.name === name);
    assert.ok(token, `Missing syntax rule: ${name}`);
    return token.settings;
  };
  assert.ok(rule('Comments').fontStyle?.split(/\s+/).includes('italic'), 'Comments must stay italic');

  const terminal = [];
  for (const brightness of ['', 'Bright']) {
    for (const name of ['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan']) {
      const key = `terminal.ansi${brightness}${name}`;
      for (const background of [colors['terminal.background'] ?? editor, colors['terminal.background'] ?? panel]) {
        terminal.push(check(colors[key], background, 4.5, key));
      }
    }
  }

  const roles = ['Comments', 'Strings', 'Numbers & constants', 'Keywords & storage', 'Parameters', 'Properties & keys', 'Functions', 'Types & classes'];
  const separation = {};
  for (const [vision, simulate] of Object.entries(simulations)) {
    const simulated = roles.map((name) => {
      const linear = toLinear(blend([color(editor), color(rule(name).foreground)]));
      // Machado simulations need linear RGB input. Relabel it to skip Culori's sRGB conversion.
      return { ...clampRgb(simulate({ ...linear, mode: 'rgb' })), mode: 'lrgb' };
    });
    let minimum = Infinity;
    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        const distance = 100 * difference(simulated[i], simulated[j]);
        assert.ok(distance >= 3.8, `${theme.name}: ${vision} separation for ${roles[i]} / ${roles[j]} is ${distance.toFixed(2)} < 3.8`);
        minimum = Math.min(minimum, distance);
      }
    }
    separation[vision] = minimum;
  }
  return { syntax: Math.min(...syntax), terminal: Math.min(...terminal), separation };
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = new URL('../', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  for (const contribution of manifest.contributes.themes) {
    const theme = JSON.parse(readFileSync(new URL(contribution.path, root), 'utf8'));
    assert.equal(theme.name, contribution.label, `${contribution.path}: theme label must match the manifest`);
    assert.equal(contribution.uiTheme, theme.type === 'dark' ? 'vs-dark' : 'vs', `${contribution.path}: theme type must match the manifest`);
    const result = auditTheme(theme);
    console.log(`${theme.name}: PASS (syntax ≥${result.syntax.toFixed(2)}:1, terminal ≥${result.terminal.toFixed(2)}:1, simulated separation ≥${Math.min(...Object.values(result.separation)).toFixed(2)})`);
  }
}
