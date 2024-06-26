# LINK TO LIVE APP: https://messagingapp-client.vercel.app/

This is the client-side repo of a full-stack messaging app with real-time chat feature. Built with:

Front-end: React + Typescript + Socket.io
Back-end: NodeJS + Express
Database: MongoDB

The backend repo: https://github.com/Stalloyde/messagingapp

All users are able search/add/delete contacts, create groups and chat with contacts. Below are a few demo accounts for you test the app out with:

```
username: pineapple
password: 123

username: bae2won
password: 123

Username: user
password: 123
```

# Photo Credits:

Photo by <a href="https://unsplash.com/@lunarts?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Volodymyr Hryshchenko</a> on <a href="https://unsplash.com/photos/three-crumpled-yellow-papers-on-green-surface-surrounded-by-yellow-lined-papers-V5vqWC9gyEU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

Photo by DS stories: https://www.pexels.com/photo/speech-bubbles-on-surface-6991386/
<a href='https://dryicons.com/free-icons/chat-logo'> Icon by Dryicons </a>

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

