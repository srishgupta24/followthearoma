'use client'

import { useState, useMemo }           from 'react'
import Fuse                            from 'fuse.js'
import type { Recipe, RecipeCategory } from '@/types'

interface UseRecipeFilterReturn {
  filtered:       Recipe[]
  activeCategory: string
  searchQuery:    string
  setCategory:    (cat: string) => void
  setSearchQuery: (q: string) => void
  resultCount:    number
}

export function useRecipeFilter(recipes: Recipe[]): UseRecipeFilterReturn {
  const [activeCategory, setCategory]  = useState<string>('all')
  const [searchQuery,    setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let results = activeCategory === 'all'
      ? recipes
      : recipes.filter(r => {
          const val = activeCategory.toLowerCase()
          return (
            r.category?.toLowerCase()  === val ||
            r.cuisine?.toLowerCase()   === val ||
            r.cuisine?.toLowerCase().includes(val) ||   // "North Indian" matches "indian"
            r.tags?.some(t => t.toLowerCase() === val)
          )
        })

    if (searchQuery.trim()) {
      const fuse = new Fuse(results, {
        keys:      [{ name: 'title', weight: 0.7 }, { name: 'description', weight: 0.2 }, { name: 'cuisine', weight: 0.1 }],
        threshold: 0.35,
      })
      results = fuse.search(searchQuery).map(r => r.item)
    }

    return results
  }, [recipes, activeCategory, searchQuery])

  return { filtered, activeCategory, searchQuery, setCategory, setSearchQuery, resultCount: filtered.length }
}
