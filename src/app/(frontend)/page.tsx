import { PopularBlogs } from '@/components/HomeSection/Popular-blog'
import { PopularDestinations } from '@/components/HomeSection/popular-destinations'
import { PopularTourPackages } from '@/components/HomeSection/Popular-tour-packages'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <section className="relative min-h-[72vh] overflow-hidden bg-black text-white">
        <Image
          alt="A Himalayan ridgeline in Nepal"
          className="object-cover opacity-70"
          fill
          priority
          sizes="100vw"
          src="/images/pinnepal-hero-1920x1080.webp"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-black/15" />
        <div className="container relative flex min-h-[72vh] items-end pb-16 pt-32">
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-white/70">
              Kathmandu to the high passes
            </p>
            <h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-normal text-white md:text-7xl">
              Nepal routes planned by people who live here
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Compare trekking routes, motorbike journeys, cultural stops, and practical field notes
              from a local team that knows the roads beyond Kathmandu.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/tour-packages">Browse Nepal packages</Link>
              </Button>
              <Button
                asChild
                className="border-white/70 text-white hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <Link href="/blog">Read route guides</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <PopularDestinations />
      <PopularTourPackages />
      <PopularBlogs />
    </main>
  )
}
