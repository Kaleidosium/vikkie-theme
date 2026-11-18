# Vikkie!!! Theme

![Vikkie Logo](./images/vikkie.png)

This purple VS Code theme is based on [luavixen](https://foxgirl.dev/)'s fursona [Vikkie](https://foxgirl.dev/vikkie/)!!! It was made for luavixen's birthday.

The dark and light themes support semantic highlighting and color VS Code's tabs, floating panels and chat windows. They use Vikkie's reference sheet colors, with extra greens for the terminal.

## Installation

Install [Vikkie!!! Theme](https://marketplace.visualstudio.com/items?itemName=atomicnumberphi.vikkie-theme) from the VS Code Marketplace. Open the Command Palette and run **Preferences: Color Theme**, then choose **Vikkie!!! Dark** or **Vikkie!!! Light**.

## Screenshots

![Screenshot of Dark theme](./images/dark.png)

![Screenshot of Light theme](./images/light.png)

## Color summary

### Reference sheet palette

These swatches come from Vikkie's reference sheet. The theme adjusts them for light and dark backgrounds.

| Swatch        | Base color            | Used for                                         |
| ------------- | --------------------- | ------------------------------------------------ |
| Fur White     | `#F4EEFF`             | Dark text, light editor background, neutral ramp |
| Fur Purple    | `#916CDB`             | Selections                                       |
| Hair Yellow   | `#F1E8B2`             | Dark strings, search highlights                  |
| Blush         | `#D9C0BA`             | Bracket pairs                                    |
| Mauve         | `#C298C2`             | Comments                                         |
| Violet        | `#9750D1`             | Buttons, badges, focus, active tabs              |
| Ink Plum      | `#3B2243`             | Dark editor background, light text, neutral ramp |
| Sock Purple   | `#5B3095`             | Light types                                      |
| Eye Teal      | `#22CED0`             | Functions, success, added lines                  |
| Deep Teal     | `#0F656E`             | Light functions                                  |
| Sweater Blue  | `#66A5E2` / `#B0C8F3` | Info, parameters, properties                     |
| Crosshair Red | `#ED0C3D`             | Errors, deletions, keywords                      |
| Bell Gold     | `#E1A665`             | Warnings, modified files, numbers                |
| Implant Mint  | `#7B9E9A`             | Bracket pairs                                    |

The audit checks main and secondary text, syntax colors and colored terminal text against their default backgrounds. Each must reach a contrast ratio of 4.5:1. Input, checkbox and dropdown borders must reach 3:1, as must keyboard focus rings on selected rows. The themes use italics for comments.

### Dark

#### Background colors

- Title bar, activity bar and status bar: `#260F2D`
- Sidebar, panels and tabs: `#2E1635`
- Editor: `#3B2243`
- Widgets (Hover, Suggest, Menus): `#452D4E`
- Border: `#4C3556`
- Control Border (Inputs, Checkboxes): `#8A7A96`

#### Text colors

- Main Text: `#F4EEFF`
- Secondary Text: `#B7ACC4`
- Muted Text (Line Numbers, Placeholders): `#81708E`

#### Accent colors

- Accent (Buttons, Badges): `#9750D1`
- Accent Line (Active Tab, Cursor): `#B988E8`
- Accent Text & Focus Ring (Links, Matches, Keyboard Focus): `#D0ABF5`
- Selection: `#A76BDC5C` (with alpha)
- Search Highlight: `#F1E8B2`

#### Status colors

- Success / Added: `#22CED0`
- Error / Deleted: `#FD7579`
- Warning / Modified: `#E1A665`
- Info: `#66A5E2`

#### Syntax highlighting colors

- Keyword, Operator, Regex & Escape: `#FD6C82`
- Function: `#22CED0`
- String: `#F1E8B2`
- Number & Constant: `#E1A665`
- Type & Class: `#BEACFF`
- Parameter: `#66A5E2` (italic)
- Property: `#B0C8F3`
- Comment: `#B995BE` (italic)
- Punctuation: `#BEB3CA`
- Bracket Pairs: `#A8DDD7` `#DEA99C` `#C0B4D6` (repeating)

#### Terminal colors

- ANSI Black: `#1F0925`
- ANSI Red: `#FD7579`
- ANSI Green: `#63D99B`
- ANSI Yellow: `#E1A665`
- ANSI Blue: `#66A5E2`
- ANSI Magenta: `#BEACFF`
- ANSI Cyan: `#22CED0`
- ANSI White: `#DBD3E7`

### Light

#### Background colors

- Title bar, activity bar, status bar, sidebar, panels and tabs: `#E8E1F3`
- Editor: `#F4EEFF`
- Widgets (Hover, Suggest, Menus): `#FBF9FF`
- Border: `#DBD3E7`
- Control Border (Inputs, Checkboxes): `#8B7B98`

#### Text colors

- Main Text: `#3B2243`
- Secondary Text: `#634E6E`
- Muted Text (Line Numbers, Placeholders): `#90809C`

#### Accent colors

- Accent (Buttons, Badges, Active Tab, Cursor): `#9750D1`
- Accent Text & Focus Ring (Links, Matches, Keyboard Focus): `#7B43AB`
- Selection: `#A76BDC47` (with alpha)
- Search Highlight: `#E1A665` / `#F1E8B2` (with alpha)

#### Status colors

- Success / Added: `#067072`
- Error / Deleted: `#C30F32`
- Warning / Modified: `#905806`
- Info: `#1367AB`

#### Syntax highlighting colors

- Keyword, Operator, Regex & Escape: `#C71E44`
- Function: `#0F656E`
- String: `#7A6002`
- Number & Constant: `#744400`
- Type & Class: `#5B3095`
- Parameter: `#004F77` (italic)
- Property: `#5065B6`
- Comment: `#7B5D86` (italic)
- Punctuation: `#634E6E`
- Bracket Pairs: `#1E514D` `#663A30` `#554967` (repeating)

#### Terminal colors

- ANSI Black: `#3B2243`
- ANSI Red: `#9F0526`
- ANSI Green: `#005A36`
- ANSI Yellow: `#714402`
- ANSI Blue: `#03508A`
- ANSI Magenta: `#6E2CA0`
- ANSI Cyan: `#055758`
- ANSI White: `#BDB2CA`

## Development

Edit the theme JSON files in `themes/` directly. Install development dependencies with `pnpm install`.

- `pnpm run audit` checks contrast, focus rings, accents, bracket colors, italic comments and syntax color separation.
- `pnpm test` runs the audit's regression tests.
- `pnpm build` creates `vikkie-theme-<version>.vsix` in the project root and runs the theme audit before packaging.

The audit uses [Culori](https://culorijs.org/) for color calculations. It compares eight syntax colors in simulations of protanopia, deuteranopia and tritanopia. It multiplies each pair's OKLab distance by 100 and requires a result of at least 3.8.

Use `pnpm run audit` to check the themes. The shorter `pnpm audit` command checks dependencies for vulnerabilities.

## License

MIT
