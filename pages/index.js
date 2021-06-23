//import { useState } from 'react'
import Head from 'next/head'
import { useSetRecoilState } from 'recoil'
import { randomizeCount } from '../lib/recoilAtoms'
import PieChart from '../components/PieChart'

export default function Home() {
  const randomize = useSetRecoilState(randomizeCount)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <PieChart />
        <button onClick={randomize}>Randomize</button>
      </main>
    </div>
  )
}
