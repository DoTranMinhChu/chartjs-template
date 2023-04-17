import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen gap-3 p-24">
      <Link href="chart_multi_choice">chart_multi_choice</Link>
      <Link href="chart_multi_choice">line_chart_stacked</Link>
      <Link href="chart_multi_choice">single_line_chart</Link>

    </main>
  )
}
