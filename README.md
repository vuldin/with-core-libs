# with-core-libs

This project is made to be used with [create-next-app](https://nextjs.org/docs/api-reference/create-next-app) to quickly create a new project with my main libraries installed and configured.
These libraries are:

- [next](https://nextjs.org/)
- [react](https://reactjs.org/)
- [prettier](https://prettier.io/)
- [stylelint](https://stylelint.io/)
- [d3](https://d3js.org/)
- [recoil](https://recoiljs.org/)
- [tailwind](https://tailwindcss.com/)
- [jest](https://jestjs.io/) _WIP_
- [react testing library](https://testing-library.com/docs/react-testing-library/intro/) _WIP_

## How to use

```
npx create-next-app -e https://github.com/vuldin/with-core-libs new-project
```

## Related VSCode extensions

`prettier` and `stylelint` work best in VSCode with their related extensions installed.

```
code --install-extension esbenp.prettier-vscode
code --install-extension stylelint.vscode-stylelint
```

Make the following in the `settings.json` for VSCode:
```
{
  "css.validate": false,
  "stylelint.enable": true
}
```