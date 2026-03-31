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

async function checkRecipes() {
  try {
    const allRecipes = await client.fetch('*[_type == "recipe"] | order(_createdAt desc) { _id, title, _createdAt }')
    console.log(`Found ${allRecipes.length} recipe(ies):\n`)
    allRecipes.forEach(r => console.log(`  ${r._id} — ${r.title}`))
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

checkRecipes()
