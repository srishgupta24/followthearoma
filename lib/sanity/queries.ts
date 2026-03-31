import { sanityClient } from './client'
import type { Recipe }  from '@/types'

// All recipes — lean projection for listing pages
const ALL_RECIPES_QUERY = `
  *[_type == "recipe"] | order(_createdAt desc) {
    _id, _createdAt, title, slug, description,
    mainImage, prepTime, cookTime, servings,
    difficulty, category, cuisine, tags,
    isKidFriendly, isFeatured
  }
`

// Full recipe — for the detail page
const RECIPE_BY_SLUG_QUERY = `
  *[_type == "recipe" && slug.current == $slug][0] {
    _id, _createdAt, title, slug, description,
    mainImage, prepTime, cookTime, servings,
    difficulty, category, cuisine, tags,
    ingredients[]{ _key, name, amount, notes },
    steps[] | order(stepNumber asc){ _key, stepNumber, instruction, tip },
    isKidFriendly, isFeatured
  }
`

const FEATURED_RECIPE_QUERY = `
  *[_type == "recipe" && isFeatured == true][0] {
    _id, title, slug, description,
    mainImage, prepTime, cookTime, servings,
    difficulty, category, cuisine
  }
`

const RELATED_RECIPES_QUERY = `
  *[_type == "recipe" && category == $category && _id != $currentId][0..2] {
    _id, title, slug, description,
    mainImage, prepTime, cookTime, servings,
    difficulty, category, cuisine, tags
  }
`

export async function getAllRecipes():    Promise<Recipe[]>        { return sanityClient.fetch<Recipe[]>(ALL_RECIPES_QUERY) }
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> { return sanityClient.fetch<Recipe | null>(RECIPE_BY_SLUG_QUERY, { slug }) }
export async function getFeaturedRecipe(): Promise<Recipe | null> { return sanityClient.fetch<Recipe | null>(FEATURED_RECIPE_QUERY) }
export async function getRelatedRecipes(category: string, currentId: string): Promise<Recipe[]> { return sanityClient.fetch<Recipe[]>(RELATED_RECIPES_QUERY, { category, currentId }) }
