import { atom, selector } from 'recoil'

export const countState = atom({
  key: 'count',
  default: [
    {
      name: 'apples',
      value: 100,
    },
    {
      name: 'bananas',
      value: 300,
    },
    {
      name: 'cherries',
      value: 250,
    },
  ],
})

export const randomizeCount = selector({
  key: 'randomizeCount',
  set: ({ set }) =>
    set(countState, () => [
      {
        name: 'apples',
        value: Math.round(Math.random() * 100),
      },
      {
        name: 'bananas',
        value: Math.round(Math.random() * 200),
      },
      {
        name: 'cherries',
        value: Math.round(Math.random() * 300),
      },
    ]),
})
