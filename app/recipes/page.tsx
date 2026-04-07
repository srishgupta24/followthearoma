// ── RECIPES PAGE (/recipes) ───────────────────────────────────
// This file: app/recipes/page.tsx
import type { Metadata }  from 'next'
import { Suspense } from 'react'
import { getAllRecipes }  from '@/lib/sanity/queries'
import { RecipeGrid }    from '@/components/recipes/RecipeGrid'

export const metadata: Metadata = {
  title: 'All Recipes',
  description: 'Browse our full collection — Indian home cooking, fresh breakfasts, global flavours.',
}
export const revalidate = 60

export default async function RecipesPage() {
  const recipes = await getAllRecipes()
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-8 md:px-20">
        <div className="mb-14">
          <div className="kicker">The Collection</div>
          <h1 className="heading-xl mb-4">All Recipes</h1>
          <p className="body-lg max-w-[52ch]">
            Indian home cooking, American breakfasts, global weeknight dinners.
            All vegetarian. All real. All made in a family kitchen.
          </p>
        </div>
        <Suspense fallback={<div className="text-stone text-sm">Loading recipes...</div>}>
          <RecipeGrid recipes={recipes} />
        </Suspense>
      </div>
    </div>
  )
}
