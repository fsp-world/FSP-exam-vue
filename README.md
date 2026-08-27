# FSP-exam-front-end

This is the front-end part of the Minecraft server website that integrates whitelist qualification acquisition and resource center

[backend application](https://github.com/tangsu99/fsp-exam-flask)

## Browser Support

The application performs a minimum browser version check on startup. Browsers
below the required version will be prompted to upgrade or switch to another
modern browser (redirected to an error page).

| Browser           | Minimum Version | Released |
| ----------------- | --------------- | -------- |
| Chrome / Chromium | 80              | 2020-02  |
| Firefox           | 80              | 2020-08  |
| Safari            | 14              | 2020-09  |
| Edge              | 80              | 2020-02  |
| Opera             | 67              | 2020-01  |

## Command

```sh
cp .env.example .env

pnpm dev
pnpm build

pnpm lint
pnpm lint:fix

pnpm format
pnpm format:check

pnpm type-check
pnpm type-check:es2020
```

## Refer

- icon from：<https://github.com/EaseCation/cube-3d-text>
- Texture:
  - minecraft vanilla resourcepacks
  - minecraft RainbowPixel resourcepacks
