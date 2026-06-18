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
          src="/media/image-hero1-1920x1080.webp"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-black/15" />
        <div className="container relative flex min-h-[72vh] items-end pb-16 pt-32">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-white/75">
              Routes, stories, and stays across Nepal
            </p>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal md:text-7xl">
              Discover Nepal, one trail at a time
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Find high-mountain routes, local travel ideas, and practical guides for planning your
              next journey through Nepal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/blog">Explore stories</Link>
              </Button>
              <Button
                asChild
                className="border-white/70 text-white hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <Link href="/search">Search routes</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-12">
        <div className="container grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Hikes</p>
            <p className="mt-2 text-2xl font-medium">Trail-first inspiration</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Places</p>
            <p className="mt-2 text-2xl font-medium">Destinations with context</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Trips</p>
            <p className="mt-2 text-2xl font-medium">Ideas ready to shape into plans</p>
          </div>
        </div>
      </section>
    </main>
  )
}
