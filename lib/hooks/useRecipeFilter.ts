'use client'

import { useState, useMemo }           from 'react'
import Fuse                            from 'fuse.js'
import type { Recipe, RecipeCategory } from '@/types'

interface UseRecipeFilterReturn {
  filtered:       Recipe[]
  activeCategory: RecipeCategory | 'all'
  searchQuery:    string
  setCategory:    (cat: RecipeCategory | 'all') => void
  setSearchQuery: (q: string) => void
  resultCount:    number
}

export function useRecipeFilter(recipes: Recipe[]): UseRecipeFilterReturn {
  const [activeCategory, setCategory]  = useState<RecipeCategory | 'all'>('all')
  const [searchQuery,    setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let results = activeCategory === 'all'
      ? recipes
      : recipes.filter(r => r.category === activeCategory || r.tags?.includes(activeCategory as any))

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
