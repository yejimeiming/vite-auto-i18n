# vite-auto-i18n

Auto wrap up i18n function

[![NPM version](https://img.shields.io/npm/v/vite-auto-i18n.svg)](https://npmjs.org/package/vite-auto-i18n)
[![NPM Downloads](https://img.shields.io/npm/dm/vite-auto-i18n.svg)](https://npmjs.org/package/vite-auto-i18n)

- [x] React
- [x] Vue with `.tsx`
- [ ] Vue with `.vue`

## Install

```bash
npm i -D vite-auto-i18n
```

## Usage

```javascript
import autoI18n from 'vite-auto-i18n'

export default {
  plugins: [
    autoI18n(/* options */)
  ]
}
```

## Example

See 👉🏻 [example](https://github.com/yejimeiming/vite-auto-i18n/tree/main/example)

## API

```ts
export interface I18nOptions {
  filter?: (text: string, id: string) => boolean | void
  filterFile?: (id: string) => boolean | void
  /**
   * @default '@/i18n'
   */
  importPath?: (id: string) => string
  /**
   * @default 'default'
   */
  importMember?: (id: string) => string
  /**
   * @default '_i18n_t_'
   */
  i18nFnName?: (id: string) => string
}
```
