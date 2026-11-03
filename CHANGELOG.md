# Change Log

All notable changes to the "vikkie-theme" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 2.0.0

- Support for VS Code's modern UI: shell, floating surfaces, connected/pill editor tabs, modern Activity Bar, and frosted-glass overlays
- New colors for the Agents window, Copilot Chat, inline chat, Next Edit Suggestions (`inlineEdit.*`), markdown alerts, SCM graph, testing and coverage, notebooks, and merge/diff editors
- Themed the rest of the workbench (menus, notifications, quick input, settings, debug, peek views) so no default grays or blues leak through
- Syntax colors reworked for clearer contrast: strings use Hair Yellow, types use Fur Purple, and functions use Eye Teal
- Enabled semantic highlighting, with `semanticTokenColors` for TypeScript, Python, Rust and similar languages
- Every syntax color reaches at least 4.5:1 (WCAG AA) contrast against the editor background in both variants
- One UI accent (Violet) for buttons, badges, focus, links and active states; yellow and teal now carry only search highlights and status
- Input, checkbox and dropdown borders reach 3:1 contrast; widget borders are tinted neutrals instead of saturated purple
- "Modified" is Bell Gold everywhere (gutter, explorer, tabs, settings)
- Syntax colors re-tuned for color-blind readers: in simulated protanopia, deuteranopia and tritanopia the closest pair improved from ΔE 1.6 to 3.9. Comments are now italic so they don't rely on color alone, and regex/escapes share the keyword color
- Light theme frame uses the side-bar lavender instead of violet
- Bracket pairs use three soft tints of Implant Mint, Blush and Fur White, repeating, so brackets read as punctuation instead of six more colors competing with the syntax
- Keyboard focus ring reaches 3:1 even on a selected row
- Terminal: every colored ANSI entry reaches 4.5:1 (light bright colors were 3:1); light numbers now use Bell Gold's hue
- The theme generator and audit live in `scripts/` (`npm run build`, `npm run audit`); `scripts/` and local tooling files are excluded from the published extension
- Updated screenshots and color summary

## 1.0.3

- Modify descriptions for discoverability

## 1.0.2

- Update README.md with Theme Screenshots

## 1.0.1

- Added extension icon

## 1.0.0

- Initial release
