<div align="center">

# jest-image
# 🌇 vs 🌆

<p>Custom jest matchers to test the visual regression</p>
</div>

[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

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
