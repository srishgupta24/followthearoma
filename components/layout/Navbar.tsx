'use client'

import { useState, useEffect } from 'react'
import Link                    from 'next/link'
import { usePathname }         from 'next/navigation'
import { MotionNav, MotionSpan } from '@/components/ui/Motion'

const LINKS = [
  { href: '/recipes',     label: 'Recipes'       },
  { href: '/#story',      label: 'Our Story'      },
  { href: '/#world',      label: 'Cuisines'       },
  { href: '/kids-corner', label: 'Little Aromas'  },
]

export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [progress,  setProgress]  = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const total = document.body.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Spice-red scroll progress line */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-spice z-[200] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />

      <MotionNav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-8 md:px-20 py-5
          transition-all duration-300
          ${scrolled
            ? 'bg-cream/95 backdrop-blur-md border-b border-ink/8 shadow-sm py-4'
            : 'bg-transparent'}
        `}
      >
        {/* LOGO — italic Playfair, American newspaper energy */}
        <Link href="/" className="font-display text-[1.35rem] italic text-ink tracking-tight">
          Follow The Aroma
          <sup className="font-body text-[0.5rem] not-italic font-semibold tracking-[0.18em] uppercase text-spice ml-1 align-super">
            ®
          </sup>
        </Link>

        {/* NAV LINKS */}
        <ul className="hidden md:flex gap-9 list-none items-center">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    relative text-[0.8rem] font-medium tracking-wide
                    transition-colors duration-200 focus-ring
                    ${active ? 'text-ink' : 'text-stone hover:text-ink'}
                  `}
                >
                  {label}
                  {active && (
                    <MotionSpan
                      layoutId="underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-spice"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <Link
          href="/#newsletter"
          className="
            hidden md:block
            bg-ink text-white text-[0.75rem] font-medium tracking-wide
            px-5 py-2.5 rounded-full
            transition-all duration-200
            hover:bg-spice hover:-translate-y-px
            focus-ring
          "
        >
          Newsletter
        </Link>
      </MotionNav>
    </>
  )
}
