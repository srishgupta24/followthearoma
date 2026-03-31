import type { Metadata }  from 'next'
import Link               from 'next/link'
import { notFound }       from 'next/navigation'
import { getRecipeBySlug, getAllRecipes, getRelatedRecipes } from '@/lib/sanity/queries'
import { RecipeCard }     from '@/components/recipes/RecipeCard'
import { urlForImage }    from '@/lib/sanity/client'
import { formatTime, TAG_META, CATEGORY_META } from '@/lib/utils'
import type { RecipePageProps } from '@/types'
import './recipe-page.scss'

export const revalidate = 60

export async function generateStaticParams() {
  const recipes = await getAllRecipes()
  return recipes.map(r => ({ slug: r.slug.current }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) return { title: 'Recipe Not Found' }
  return {
    title:       recipe.title,
    description: recipe.description,
    openGraph: {
      title:       recipe.title,
      description: recipe.description,
      images: recipe.mainImage
        ? [{ url: urlForImage(recipe.mainImage).width(1200).height(630).url() }]
        : [],
    },
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) notFound()

  const related    = await getRelatedRecipes(recipe.category, recipe._id)
  const cat        = CATEGORY_META[recipe.category]
  const imageUrl   = recipe.mainImage
    ? urlForImage(recipe.mainImage).format('webp').url()
    : null

  // JSON-LD Recipe Schema — makes Google show rich results
  const jsonLd = {
    '@context':          'https://schema.org',
    '@type':             'Recipe',
    name:                recipe.title,
    description:         recipe.description,
    image:               imageUrl ?? undefined,
    prepTime:            `PT${recipe.prepTime}M`,
    cookTime:            `PT${recipe.cookTime}M`,
    totalTime:           `PT${recipe.prepTime + recipe.cookTime}M`,
    recipeYield:         `${recipe.servings} servings`,
    recipeCategory:      cat.label,
    recipeIngredient:    recipe.ingredients?.map(i => `${i.amount} ${i.name}`) ?? [],
    recipeInstructions:  recipe.steps?.map(s => ({ '@type': 'HowToStep', text: s.instruction })) ?? [],
    suitableForDiet:     'https://schema.org/VegetarianDiet',
    author:              { '@type': 'Person', name: 'Follow The Aroma' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="recipe">
        {/* Header */}
        <div className="recipe__header">
          <div className="recipe__header-inner">
            <div className="recipe__tags">
              <span className="recipe__tag recipe__tag--category">
                {cat.emoji} {cat.label}
              </span>
              {recipe.tags?.map(tag => {
                const m = TAG_META[tag]
                return m ? (
                  <span key={tag} className={`recipe__tag ${m.colour}`}>
                    {m.label}
                  </span>
                ) : null
              })}
            </div>
            <h1 className="recipe__title">{recipe.title}</h1>
            {recipe.cuisine && <p className="recipe__cuisine">{recipe.cuisine}</p>}
          </div>
        </div>

        {/* Hero Image */}
        {imageUrl && (
          <div className="recipe__hero">
            <div className="recipe__hero-inner">
              <img src={imageUrl} alt={recipe.title} className="recipe__image" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="recipe__content">
          {/* Quick Stats */}
          <div className="recipe__stats">
            {[
              { l: 'Prep Time',   v: `${recipe.prepTime} min` },
              { l: 'Cook Time',   v: `${recipe.cookTime} min` },
              { l: 'Serves',      v: recipe.servings           },
              { l: 'Difficulty',  v: recipe.difficulty         },
            ].map(({ l, v }) => (
              <div key={l} className="recipe__stat">
                <div className="recipe__stat-label">{l}</div>
                <div className="recipe__stat-value">{v}</div>
              </div>
            ))}
          </div>

          <p className="recipe__description">{recipe.description}</p>

          {/* Ingredients */}
          <section>
            <h2 className="recipe__section-title">Ingredients</h2>
            <ul className="recipe__ingredients">
              {recipe.ingredients?.map(ing => (
                <li key={ing._key} className="recipe__ingredient">
                  <span className="recipe__ingredient-name">{ing.name}</span>
                  <span className="recipe__ingredient-amount">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section className="recipe__steps">
            <h2 className="recipe__section-title">Method</h2>
            <ol>
              {recipe.steps?.map((step, i) => (
                <li key={step._key} className="recipe__step">
                  <div className="recipe__step-number">{i + 1}</div>
                  <div>
                    <p className="recipe__step-instruction">{step.instruction}</p>
                    {step.tip && <p className="recipe__step-tip">💡 {step.tip}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Link href="/recipes" className="recipe__back-link">
            ← Back to all recipes
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="recipe__related">
            <div className="recipe__related-inner">
              <h2 className="recipe__related-title">You Might Also Like</h2>
              <div className="recipe__related-grid">
                {related.map((r, i) => <RecipeCard key={r._id} recipe={r} index={i} />)}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  )
}
