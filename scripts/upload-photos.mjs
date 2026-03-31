#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Photo Upload Script
// Reads every image from /photos and uploads ONLY NEW photos to Sanity CDN
// (Already-uploaded photos are skipped; tracked in photos-manifest.json)
//
// HOW TO RUN:
//   1. Add photos to the /photos folder
//   2. Fill in .env.local with your Sanity tokens
//   3. node scripts/upload-photos.mjs
// ─────────────────────────────────────────────────────────────

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient }  from '@sanity/client'
import { createReadStream, readdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname }       from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token:      process.env.SANITY_WRITE_TOKEN,
  useCdn:     false,
})

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp']

async function uploadPhoto(filePath) {
  const filename = basename(filePath)
  const ext      = extname(filePath).toLowerCase()
  if (!SUPPORTED.includes(ext)) { console.log(`⏭  Skipping ${filename}`); return null }

  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  console.log(`📤 Uploading ${filename}...`)

  try {
    const asset = await client.assets.upload('image', createReadStream(filePath), { filename, contentType: mimeType })
    // Extract just the ID without extension for the map (e.g., "18147130591051480" from "18147130591051480.jpg")
    const photoId = filename.split('.')[0]
    console.log(`✅ ${filename}\n   Asset ID: ${asset._id}\n   URL: ${asset.url}\n`)
    return { filename, photoId, assetId: asset._id, url: asset.url }
  } catch (err) {
    console.error(`❌ Failed: ${filename} —`, err.message)
    return null
  }
}

async function main() {
  const photosDir = join(__dirname, '..', 'photos')
  const manifestPath = 'photos-manifest.json'

  let files
  try {
    files = readdirSync(photosDir)
  } catch {
    console.error('❌ No /photos folder found. Create one and add your images.')
    process.exit(1)
  }

  const images = files.filter(f => SUPPORTED.includes(extname(f).toLowerCase()) && statSync(join(photosDir, f)).isFile())
  if (!images.length) { console.log('No images found in /photos'); process.exit(0) }

  // Load existing manifest (tracks already-uploaded photos)
  let manifest = {}
  if (existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch {
      console.warn('⚠️  Could not read manifest, starting fresh...')
    }
  }

  // Find only NEW photos (not in manifest)
  const newPhotos = images.filter(f => !manifest[f])
  const existingCount = images.length - newPhotos.length

  console.log(`\n🌿 Follow The Aroma — Photo Uploader`)
  console.log(`Found ${images.length} total image(s) | ${existingCount} already uploaded | ${newPhotos.length} new\n`)

  if (!newPhotos.length) {
    console.log('✨ Nothing new to upload! All photos already in Sanity.')
    console.log('📋 Photo map updated: photo-map.json\n')
    // Still regenerate photo-map from manifest
    writeFileSync('photo-map.json', JSON.stringify(manifest, null, 2))
    return
  }

  const results = []
  for (const f of newPhotos) {
    const r = await uploadPhoto(join(photosDir, f))
    if (r) {
      results.push(r)
      manifest[f] = r.assetId  // Add to manifest as we go
    }
  }

  // Save updated manifest
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  // Save photo map for bulk import (includes all photos, old + new)
  writeFileSync('photo-map.json', JSON.stringify(manifest, null, 2))

  console.log(`\n✨ Done! ${results.length}/${newPhotos.length} new photos uploaded.`)
  console.log(`📋 Manifest saved to ${manifestPath}`)
  console.log('📋 Photo map saved to photo-map.json for bulk recipe import.\n')
}

main().catch(console.error)
