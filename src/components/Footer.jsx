import Link from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/ideas', label: 'Idea Library' },
  { href: '/listings', label: 'Browse Listings' },
  { href: '/post', label: 'Post a Listing' },
  { href: '/how-it-works', label: 'How It Works' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                <Image
                  src="/wastewise-logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-lg font-bold">
                Waste<span className="text-royal-light">Wise</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Turning waste into opportunity. We connect waste generators with
              entrepreneurs who see raw material where others see trash.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Every piece of waste is someone else's raw material. WasteWise makes
              the connection happen — creating value, reducing landfill, and
              building sustainable businesses.
            </p>
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 12c0 1.74-.67 3.33-1.77 4.52l1.42 1.42A7.959 7.959 0 0019.5 12c0-2.36-1.03-4.49-2.65-5.94l-1.42 1.42C16.83 8.67 17.5 10.26 17.5 12zm-5-7.5v3l3.61-3.61C14.77 2.74 13.18 2.07 11.44 2L12.5 4.5zM4.5 12c0-1.74.67-3.33 1.77-4.52L4.85 6.06A7.959 7.959 0 002.5 12c0 2.36 1.03 4.49 2.65 5.94l1.42-1.42C5.17 15.33 4.5 13.74 4.5 12z" />
              </svg>
              <span>Waste less. Build more.</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} WasteWise. Building a circular economy,
            one connection at a time.
          </p>
          <p className="text-gray-500 text-xs">
            Made for a cleaner planet
          </p>
        </div>
      </div>
    </footer>
  );
}
