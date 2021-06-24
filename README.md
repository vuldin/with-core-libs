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

Make the following updates in your VSCode `settings.json`:
```
{
  "css.validate": false,
  "stylelint.enable": true
}
```

## More details

Getting these libraries to all work with each other was not as simple as I hoped.
Getting nextjs and d3 to work together was especially problematic due to them handling ES modules differently.
Here are links to more information on this and other areas to consider for future dependency upgrades or refactors:
- https://tailwindcss.com/docs/using-with-preprocessors#build-time-imports
- https://github.com/muratkemaldar/using-react-hooks-with-d3
- https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
- https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#gistcomment-3760583
- https://github.com/martpie/next-transpile-modules
- https://gitmemory.com/issue/vercel/next.js/13268/743911710 (didn't work for me)
- https://www.kyrelldixon.com/blog/setup-jest-and-react-testing-library-with-nextjs