import Head from 'next/head'
import { schemeOranges, schemeBlues, schemeGreens, schemePurples } from 'd3'
import { useSetRecoilState } from 'recoil'
import { countState, randomizeCount } from '../lib/recoilAtoms'
import PieChart from '../components/PieChart'

export default function Home() {
  const randomize = useSetRecoilState(randomizeCount)

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 dark:text-gray-100">
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={randomize}>Randomize</button>
      <main className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
        <section aria-labelledby="tempo-title" className="p-2 bg-white rounded dark:bg-gray-900">
          <h2 className="section-title" id="tempo-title">
            Tempo
          </h2>
          <div className="grid gap-8">
            <PieChart title="Delivery Lead Time" state={countState} scheme={schemeOranges} />
            <PieChart title="Deployment Frequency" state={countState} scheme={schemeBlues} />
          </div>
        </section>
        <section
          aria-labelledby="stability-title"
          className="p-2 bg-white rounded dark:bg-gray-900"
        >
          <h2 className="section-title" id="stability-title">
            Stability
          </h2>
          <div className="grid gap-8">
            <PieChart title="Mean Time to Restore" state={countState} scheme={schemePurples} />
            <PieChart title="Change Fail Rate" state={countState} scheme={schemeGreens} />
          </div>
        </section>
      </main>
    </div>
  )
}
