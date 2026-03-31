import Link            from 'next/link'
import Image           from 'next/image'
import { MotionDiv }    from '@/components/ui/Motion'
import { urlForImage } from '@/lib/sanity/client'
import { formatTime, CATEGORY_META, TAG_META } from '@/lib/utils'
import type { Recipe } from '@/types'

interface RecipeCardProps {
  recipe:    Recipe
  priority?: boolean
  index?:    number
}

export function RecipeCard({ recipe, priority = false, index = 0 }: RecipeCardProps) {
  const cat      = CATEGORY_META[recipe.category]
  const imageUrl = recipe.mainImage
    ? urlForImage(recipe.mainImage).width(600).height(420).format('webp').url()
    : null

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      whileHover={{ y: -5 }}
      className="group bg-white border border-ink/8 overflow-hidden cursor-pointer"
      style={{ boxShadow: '0 2px 8px rgba(26,22,18,0.05)' }}
    >
      <Link href={`/recipes/${recipe.slug.current}`} className="block focus-ring">

        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-parchment">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.mainImage?.alt ?? recipe.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-7xl">
              {cat.emoji}
            </div>
          )}

          {/* Chips */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {recipe.tags?.slice(0,2).map(tag => {
              const meta = TAG_META[tag]
              return meta ? (
              <span key={tag} className={`chip ${meta.colour} backdrop-blur-sm border border-white/20 shadow`}>
                {meta.label}
              </span>) : null
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 pb-4">
          {/* Cuisine label — spice red, like NYT section label */}
          <div className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-spice mb-2">
            {recipe.cuisine ?? cat.label}
          </div>
          <h3 className="font-display text-[1.2rem] leading-snug text-ink mb-2 group-hover:text-spice transition-colors">
            {recipe.title}
          </h3>
          <p className="text-[0.82rem] text-stone font-light leading-relaxed line-clamp-2">
            {recipe.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-ink/6 bg-parchment/60">
          <span className="text-[0.72rem] text-sand">
            {formatTime(recipe.prepTime + recipe.cookTime)} · {recipe.servings} servings
          </span>
          <span className="text-[0.72rem] font-semibold text-spice tracking-wide
                           flex items-center gap-1 group-hover:gap-2 transition-all">
            Read <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </Link>
    </MotionDiv>
  )
}
