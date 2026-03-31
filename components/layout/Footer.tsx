import Link from 'next/link'

const LINKS = {
  Recipes: [
    { href: '/recipes?cat=indian',    label: 'Indian'      },
    { href: '/recipes?cat=breakfast', label: 'Breakfast'   },
    { href: '/recipes?cat=salads',    label: 'Salads'      },
    { href: '/recipes?cat=global',    label: 'Global'      },
    { href: '/recipes?tag=quick',     label: 'Quick Meals' },
  ],
  Explore: [
    { href: '/#world',       label: 'By Cuisine'    },
    { href: '/kids-corner',  label: 'Little Aromas' },
    { href: '/#seasonal',    label: 'By Season'     },
  ],
  Us: [
    { href: '/about',          label: 'Our Story'  },
    { href: '/#newsletter',    label: 'Newsletter' },
    { href: '/about#contact',  label: 'Contact'    },
    { href: '/privacy',        label: 'Privacy'    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-ink text-white/40">
      <div className="max-w-7xl mx-auto px-8 md:px-20 py-20">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/8">

          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-[1.35rem] italic text-white/80 block mb-4">
              Follow The Aroma
            </Link>
            <p className="text-sm font-light leading-relaxed max-w-[30ch] text-white/35">
              A vegetarian family kitchen. Indian at heart,
              global at the table. Real food, cooked by feel.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-white/50 mb-5">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-light text-white/30 hover:text-spice-soft transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 text-xs text-white/20">
          <span>© {new Date().getFullYear()} Follow The Aroma. Real food. Cooked by feel.</span>
          <span>Indian at heart. Global at the table.</span>
        </div>
      </div>
    </footer>
  )
}
