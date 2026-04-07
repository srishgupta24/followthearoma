'use client'

import { MotionDiv, AnimatePresence } from '@/components/ui/Motion'
import { RecipeCard }              from './RecipeCard'
import { useRecipeFilter }         from '@/lib/hooks/useRecipeFilter'
import type { Recipe } from '@/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'


export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const searchParams = useSearchParams()
  const { filtered, activeCategory, searchQuery, setCategory, setSearchQuery, resultCount } = useRecipeFilter(recipes)

  const cuisineFilters = useMemo(() => {
      const seen = new Set<string>()
      const filters: Array<{ value: string; label: string }> = [
        { value: 'all', label: 'All' }
      ]

      // Fixed category filters first
      const categories = [
        { value: 'indian',    label: '🍛 Indian'    },
        { value: 'breakfast', label: '🌅 Breakfast' },
        { value: 'salads',    label: '🥗 Salads'    },
        { value: 'global',    label: '🌍 Global'    },
        { value: 'snacks',    label: '🥙 Snacks'    },
      ]
      categories.forEach(c => { filters.push(c); seen.add(c.value) })

      // Then add any unique cuisines from recipe data not already covered
      recipes.forEach(r => {
        if (!r.cuisine) return
        const val = r.cuisine.toLowerCase()
        // Skip if already covered by a category filter
        if (seen.has(val)) return
        // Skip generic ones already captured above
        if (['north indian','south indian'].some(x => val.includes('indian'))) return
        seen.add(val)
        filters.push({ value: val, label: r.cuisine })
      })

      return filters
    }, [recipes])

  useEffect(() => {
    const cat     = searchParams.get('cat')
    const cuisine = searchParams.get('cuisine')
    const search  = searchParams.get('search')

    if (cat)     setCategory(cat)
    if (cuisine) setCategory(cuisine)
    if (search)  setSearchQuery(search)
  }, [searchParams])
  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sand text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="
              pl-10 pr-5 py-2.5 rounded-full
              border border-ink/12 bg-white
              text-sm font-light text-ink
              placeholder:text-sand
              focus:outline-none focus:border-spice
              transition-colors w-60
            "
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
         {cuisineFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`
                px-4 py-2 rounded-full border text-xs font-medium tracking-wide
                transition-all duration-200 focus-ring
                ${activeCategory === value
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-stone border-ink/12 hover:border-ink'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-sand mb-8">{resultCount} recipe{resultCount !== 1 ? 's' : ''}</p>

      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <MotionDiv
            key={activeCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((recipe, i) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={i} priority={i < 3} />
            ))}
          </MotionDiv>
        ) : (
          <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 text-stone"
          >
            <div className="text-5xl mb-4">🫕</div>
            <p className="font-display text-2xl text-ink mb-2">Nothing found</p>
            <p className="text-sm font-light">
              Try a different search or{' '}
              <button
                onClick={() => { setSearchQuery(''); setCategory('all') }}
                className="text-spice underline"
              >
                clear filters
              </button>
            </p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}
