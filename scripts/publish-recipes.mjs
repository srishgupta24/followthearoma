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

async function publishRecipe() {
  try {
    // Find the draft recipe
    const drafts = await client.fetch('*[_type == "recipe" && _id match "drafts.*"]')
    
    if (drafts.length === 0) {
      console.log('No draft recipes found.')
      process.exit(0)
    }

    console.log(`Found ${drafts.length} draft recipe(ies). Publishing...`)

    for (const draft of drafts) {
      const draftId = draft._id
      const publishedId = draftId.replace('drafts.', '')
      
      // Publish: copy draft to published
      await client.patch(publishedId).set(draft).commit()
      
      // Remove draft
      await client.delete(draftId)
      
      console.log(`✅ Published: ${draft.title}`)
    }

    console.log('\n🎉 Recipe is live! Visit http://localhost:3000/recipes')
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

publishRecipe()
