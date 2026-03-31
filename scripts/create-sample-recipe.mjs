#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET,
  token:     process.env.SANITY_WRITE_TOKEN,
  useCdn:    false,
  apiVersion: '2024-01-01',
})

const sampleRecipe = {
  _type: 'recipe',
  title: 'Yogurt Parfait (Apple & Peach)',
  slug: { current: 'yogurt-parfait-apple-peach' },
  description: 'A delightful layered parfait with caramelized peaches, creamy yogurt, and fresh apple. Perfect for breakfast or dessert.',
  cuisine: 'American',
  mainImage: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: 'image-2e11f0ac23fa7ce72e52900ddc65d26d8ec75f0b-800x800-jpg'
    }
  },
  prepTime: 10,
  cookTime: 15,
  servings: 2,
  difficulty: 'Easy',
  category: 'breakfast',
  tags: ['quick', 'kid-friendly'],
  ingredients: [
    { _key: '1', name: 'Peaches', amount: '2 ripe' },
    { _key: '2', name: 'Apple', amount: '1' },
    { _key: '3', name: 'Yogurt', amount: '1 cup' },
    { _key: '4', name: 'Lime', amount: '1, juiced' },
    { _key: '5', name: 'Honey or sugar', amount: 'to taste' },
    { _key: '6', name: 'Oats or granola', amount: '1/4 cup' },
  ],
  steps: [
    { _key: '1', stepNumber: 1, instruction: 'Peel the skin from 2 ripe peaches and take out their pit.' },
    { _key: '2', stepNumber: 2, instruction: 'Cut the peaches into small pieces and put them on a slightly heated/greased pan.' },
    { _key: '3', stepNumber: 3, instruction: 'Add sugar/honey as per your taste. Add little lime juice and sauté the peaches until the chunks become gooey.' },
    { _key: '4', stepNumber: 4, instruction: 'Keep the peach jam aside to cool down.' },
    { _key: '5', stepNumber: 5, instruction: 'Add honey to yogurt and mix well. In a jar add one layer of yogurt and then a layer of jam.' },
    { _key: '6', stepNumber: 6, instruction: 'Top with apple chunks. Oats/granola can also be added for the crunch!' },
    { _key: '7', stepNumber: 7, instruction: 'Yogurt parfait is ready. Serve immediately or refrigerate until serving.' },
  ],
  isKidFriendly: true,
  isFeatured: true,
}

async function createRecipe() {
  try {
    const result = await client.create(sampleRecipe)
    console.log('✅ Recipe created successfully!')
    console.log(`   ID: ${result._id}`)
    console.log(`   Title: ${result.title}`)
    console.log(`   Slug: ${result.slug.current}`)
    console.log('\nVisit Sanity Studio to verify or publish it.')
  } catch (err) {
    console.error('❌ Failed to create recipe:', err.message)
    process.exit(1)
  }
}

createRecipe()
