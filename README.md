# jest-image
# 🌇 vs 🌆

#### Custom jest matchers to test the visual regression


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

![GitHub followers](https://img.shields.io/github/followers/zaqqaz.svg?style=social)
![GitHub stars](https://img.shields.io/github/watchers/zaqqaz/jest-image.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/zaqqaz/jest-image.svg?style=social)


## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev jest-image
```

or

```
yarn add --D jest-image
```

## Usage

Import `jest-image/extend-expect` once (for instance in your [tests setup file][])
and you're good to go:

[tests setup file]: https://facebook.github.io/jest/docs/en/configuration.html#setuptestframeworkscriptfile-string

```javascript
import 'jest-image/extend-expect'
```

Alternatively, you can selectively import only the matchers you intend to use,
and extend jest's `expect` yourself:

```javascript
import { toMatchImageBuffer } from 'jest-image'

expect.extend({ toMatchImageBuffer })
```

<hr />

### `toMatchImageBuffer`

```typescript
toMatchImageBuffer(buffer: Buffer)
```

Fastest way to compare images.
It takes less than 1ms to get a result.
