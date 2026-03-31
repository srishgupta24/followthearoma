// TYPES — Follow The Aroma
// Categories reflect the real mix: Indian home cooking + American mornings + global curiosity

export interface Recipe {
  _id:           string
  _createdAt:    string
  title:         string
  slug:          { current: string }
  description:   string
  mainImage:     SanityImage
  prepTime:      number
  cookTime:      number
  servings:      number
  difficulty:    'Easy' | 'Medium' | 'Quick'
  category:      RecipeCategory
  cuisine:       string            // Free text: "North Indian", "American", "Fusion"
  tags:          RecipeTag[]
  ingredients:   Ingredient[]
  steps:         Step[]
  isKidFriendly: boolean
  isFeatured:    boolean
}

export interface Ingredient {
  _key:   string
  name:   string
  amount: string
  notes?: string
}

export interface Step {
  _key:        string
  stepNumber:  number
  instruction: string
  tip?:        string
}

// Broad enough to cover the real content mix
export type RecipeCategory =
  | 'indian'      // Dal, curry, sabzi, sambar
  | 'breakfast'   // Pancakes, overnight oats, avocado toast, eggs
  | 'salads'      // Bowls, kale salads, grain salads
  | 'soups'       // Soups, stews, dals served as soup
  | 'global'      // Italian, Mexican, Japanese, fusion
  | 'snacks'      // Sides, chaat, small plates

export type RecipeTag =
  | 'quick'
  | 'indian'
  | 'kid-friendly'
  | 'one-pot'
  | 'gluten-free'
  | 'dairy-free'
  | 'high-protein'

export interface SanityImage {
  asset:    { _ref: string; _type: 'reference' }
  alt?:     string
  hotspot?: { x: number; y: number }
}

export interface RecipePageProps {
  params: { slug: string }
}

export type ApiResponse<T> =
  | { data: T;    error: null   }
  | { data: null; error: string }
