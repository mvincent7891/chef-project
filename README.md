# Getting Started

This project is built with Vite (French for _quick_), in particular the React+TypeScript Vite template (see below).

```bash
npm i
npm run dev
```

The only piece of config you'll need is an Open AI account and an API key. Simply add it to your `.env`:

```bash
export VITE_APP_OPEN_AI_KEY=<YOUR_OPEN_AI_KEY>
```

:warning: This project is meant for personal, local use only. Deploying this project would expose your API credentials. Open AI prevents this kind of use, which we bypass with the `dangerouslyAllowBrowser: true` parameter.

:bulb: Vite automatically pulls the `.env` file into your environment, accessible anywhere in the project with `import.meta.env.<ENV_VAR_NAME>`.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
