#!/usr/bin/env node
/**
 * 🌿 Follow The Aroma — Safe Recipe Workflow
 * 
 * Complete workflow safeguard:
 * 1. Validates recipe doesn't already exist (by slug)
 * 2. Uploads new photos to Sanity CDN
 * 3. Creates recipe with proper photo reference
 * 4. Publishes immediately
 * 5. Prevents duplicate creation
 * 
 * Usage:
 *   node scripts/add-recipe-safe.mjs
 *   Follow the prompts to add photos and recipe data
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@sanity/client'
import { createReadStream, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { extname, basename } from 'path'
import readline from 'readline'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp']
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

// Async prompt helper
function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve))
}

async function uploadPhoto(filePath) {
  const filename = basename(filePath)
  const ext = extname(filePath).toLowerCase()
  
  if (!SUPPORTED_IMAGE_TYPES.includes(ext)) {
    console.error(`❌ Unsupported image format: ${ext}`)
    return null
  }

  // Check file exists
  try {
    statSync(filePath)
  } catch {
    console.error(`❌ File not found: ${filePath}`)
    return null
  }

  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  
  console.log(`📤 Uploading ${filename}...`)
  try {
    const asset = await client.assets.upload('image', createReadStream(filePath), { filename, contentType: mimeType })
    console.log(`✅ Photo uploaded: ${asset._id}`)
    return asset
  } catch (err) {
    console.error(`❌ Upload failed: ${err.message}`)
    return null
  }
}

async function checkRecipeExists(slug) {
  try {
    const existing = await client.fetch('*[_type == "recipe" && slug.current == $slug][0]', { slug })
    return !!existing
  } catch {
    return false
  }
}

async function createRecipe(recipeData, assetId) {
  try {
    const doc = {
      _type: 'recipe',
      title: recipeData.title,
      slug: { current: recipeData.slug },
      description: recipeData.description,
      cuisine: recipeData.cuisine || 'Other',
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: recipeData.title,
      },
      prepTime: parseInt(recipeData.prepTime) || 0,
      cookTime: parseInt(recipeData.cookTime) || 0,
      servings: parseInt(recipeData.servings) || 1,
      difficulty: recipeData.difficulty || 'Easy',
      category: recipeData.category || 'global',
      tags: recipeData.tags || [],
      ingredients: (recipeData.ingredients || []).map((ing, i) => ({
        _key: String(i),
        name: ing.name,
        amount: ing.amount,
      })),
      steps: (recipeData.steps || []).map((step, i) => ({
        _key: String(i),
        stepNumber: i + 1,
        instruction: step.instruction || step,
      })),
      isKidFriendly: recipeData.isKidFriendly || false,
      isFeatured: recipeData.isFeatured || false,
    }

    const result = await client.create(doc)
    console.log(`✅ Recipe created & published: ${recipeData.title}`)
    return result._id
  } catch (err) {
    console.error(`❌ Failed to create recipe: ${err.message}`)
    return null
  }
}

async function main() {
  console.log('\n🌿 Follow The Aroma — Safe Recipe Workflow')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // Step 1: Get recipe basic info
    console.log('📝 Recipe Details\n')
    const title = await prompt('Recipe title: ')
    const slug = await prompt('Recipe slug (URL-friendly): ')
    const description = await prompt('Short description (max 200 chars): ')
    const cuisine = await prompt('Cuisine type (e.g., Indian, American): ')

    // Check for duplicates
    if (await checkRecipeExists(slug)) {
      console.error(`\n❌ Recipe with slug "${slug}" already exists!`)
      console.error('To prevent duplicates, please use a different slug.')
      rl.close()
      process.exit(1)
    }

    // Step 2: Photo upload
    console.log('\n📸 Photo Upload\n')
    const photoPath = await prompt('Full path to recipe photo: ')
    const asset = await uploadPhoto(photoPath)
    
    if (!asset) {
      console.error('❌ Photo upload failed. Cannot proceed.')
      rl.close()
      process.exit(1)
    }

    // Step 3: Recipe details
    console.log('\n⏱️  Cooking Info\n')
    const prepTime = await prompt('Prep time (minutes): ')
    const cookTime = await prompt('Cook time (minutes): ')
    const servings = await prompt('Servings: ')
    const difficulty = await prompt('Difficulty (Easy/Medium/Quick) [Easy]: ') || 'Easy'
    const category = await prompt('Category (indian/breakfast/salads/soups/global/snacks) [global]: ') || 'global'
    const isKidFriendly = (await prompt('Kid-friendly? (yes/no) [no]: ')) === 'yes'
    const isFeatured = (await prompt('Featured recipe? (yes/no) [no]: ')) === 'yes'

    // Step 4: Ingredients
    console.log('\n🥘 Ingredients (enter blank line when done)\n')
    const ingredients = []
    let ingredientNum = 1
    while (true) {
      const ing = await prompt(`Ingredient ${ingredientNum} name (or press Enter to finish): `)
      if (!ing.trim()) break
      const amount = await prompt(`${ing} — amount: `)
      ingredients.push({ name: ing, amount })
      ingredientNum++
    }

    // Step 5: Steps
    console.log('\n👨‍🍳 Cooking Steps (enter blank line when done)\n')
    const steps = []
    let stepNum = 1
    while (true) {
      const instruction = await prompt(`Step ${stepNum} (or press Enter to finish): `)
      if (!instruction.trim()) break
      steps.push({ instruction })
      stepNum++
    }

    // Summary & confirmation
    console.log('\n✨ Recipe Summary')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Title:        ${title}`)
    console.log(`Slug:         ${slug}`)
    console.log(`Cuisine:      ${cuisine}`)
    console.log(`Prep:         ${prepTime} min | Cook: ${cookTime} min | Servings: ${servings}`)
    console.log(`Difficulty:   ${difficulty}`)
    console.log(`Category:     ${category}`)
    console.log(`Kid-friendly: ${isKidFriendly ? 'Yes' : 'No'}`)
    console.log(`Featured:     ${isFeatured ? 'Yes' : 'No'}`)
    console.log(`Ingredients:  ${ingredients.length} items`)
    console.log(`Steps:        ${steps.length} steps`)
    console.log(`Photo:        ${asset?.url?.split('/').pop() || 'Uploaded'}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const confirm = await prompt('Create and publish this recipe? (yes/no): ')
    if (confirm.toLowerCase() !== 'yes') {
      console.log('⏭️  Recipe creation cancelled.')
      rl.close()
      process.exit(0)
    }

    // Create recipe
    const recipeId = await createRecipe(
      {
        title,
        slug,
        description,
        cuisine,
        prepTime,
        cookTime,
        servings,
        difficulty,
        category,
        isKidFriendly,
        isFeatured,
        ingredients,
        steps,
      },
      asset._id
    )

    if (recipeId) {
      console.log(`\n🎉 Success! Recipe is now live.`)
      console.log(`📖 View in Studio: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
      console.log(`🌐 Visit: http://localhost:3000/recipes/${slug}\n`)
    }

    rl.close()
  } catch (err) {
    console.error(`❌ Error: ${err.message}`)
    rl.close()
    process.exit(1)
  }
}

main()
