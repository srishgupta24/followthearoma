import type { RecipeCategory, RecipeTag } from '@/types'

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours     = Math.floor(minutes / 60)
  const remaining = minutes % 60
  const label     = hours === 1 ? 'hr' : 'hrs'
  return remaining === 0 ? `${hours} ${label}` : `${hours} ${label} ${remaining} min`
}

export function totalTime(prep: number, cook: number): string {
  return formatTime(prep + cook)
}

export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Categories — mix of Indian, American, global
export const CATEGORY_META: Record<RecipeCategory, { label: string; emoji: string }> = {
  indian:    { label: 'Indian',     emoji: '🍛' },
  breakfast: { label: 'Breakfast',  emoji: '🌅' },
  salads:    { label: 'Salads & Bowls', emoji: '🥗' },
  soups:     { label: 'Soups',      emoji: '🫕' },
  global:    { label: 'Global',     emoji: '🌍' },
  snacks:    { label: 'Snacks',     emoji: '🥙' },
  dessert:  { label: 'Desserts',   emoji: '🍰' },
  drinks:    { label: 'Drinks',     emoji: '🍹' },
}

export const TAG_META: Record<RecipeTag, { label: string; colour: string }> = {
  'quick':        { label: '⚡ Quick',        colour: 'bg-spice text-white shadow-sm'        },
  'indian':       { label: '🇮🇳 Indian',      colour: 'bg-ink text-white shadow-sm'          },
  'kid-friendly': { label: '👧 Kids',         colour: 'bg-gold text-white shadow-sm'         },
  'one-pot':      { label: '🫕 One Pot',      colour: 'bg-bark text-white shadow-sm'         },
  'gluten-free':  { label: 'GF',              colour: 'bg-spice text-white shadow-sm'        },
  'dairy-free':   { label: 'DF',              colour: 'bg-spice text-white shadow-sm'        },
  'high-protein': { label: '💪 Protein',      colour: 'bg-cardamom text-white shadow-sm'     },
}

export function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const m = new Date().getMonth()
  if (m >= 2 && m <= 4)  return 'spring'
  if (m >= 5 && m <= 7)  return 'summer'
  if (m >= 8 && m <= 10) return 'autumn'
  return 'winter'
}

// The "ticker" items — a mix showing the range of the kitchen
export const TICKER_ITEMS = [
  'Dal Tadka', 'Avocado Toast', 'Masala Pasta', 'Overnight Oats',
  'Sambar', 'Buddha Bowl', 'Palak Paneer', 'Banana Pancakes',
  'Chickpea Tacos', 'Kale Caesar', 'Aloo Sabzi', 'French Toast',
]

// Cuisine worlds for the Global Table section
export const CUISINE_WORLDS = [
  { flag: '🇮🇳', name: 'Indian',    desc: 'Home base'       },
  { flag: '🇺🇸', name: 'American',  desc: 'Weekend brunch'  },
  { flag: '🇮🇹', name: 'Italian',   desc: 'Tuesday pasta'   },
  { flag: '🇲🇽', name: 'Mexican',   desc: 'Taco nights'     },
  { flag: '🌍',  name: 'Exploring', desc: 'Always more'     },
]

export const SEASONAL_PRODUCE = {
  spring:  [{ name: 'Peas',     emoji: '🫛' }, { name: 'Spinach',    emoji: '🥬' }, { name: 'Asparagus', emoji: '🥦' }],
  summer:  [{ name: 'Tomatoes', emoji: '🍅' }, { name: 'Courgette',  emoji: '🥒' }, { name: 'Sweetcorn', emoji: '🌽' }],
  autumn:  [{ name: 'Pumpkin',  emoji: '🎃' }, { name: 'Mushrooms',  emoji: '🍄' }, { name: 'Apples',    emoji: '🍎' }],
  winter:  [{ name: 'Kale',     emoji: '🥬' }, { name: 'Cauliflower',emoji: '🥦' }, { name: 'Carrots',   emoji: '🥕' }],
}
