import { defineField, defineType } from 'sanity'

// This schema tells Sanity what fields a recipe has.
// Sanity reads this and auto-builds the editor form in Studio.

export const recipeSchema = defineType({
  name:  'recipe',
  title: 'Recipe',
  type:  'document',

  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'cuisine' },
  },

  fields: [
    defineField({ name: 'title',       title: 'Title',            type: 'string',  validation: r => r.required().min(5).max(80) }),
    defineField({ name: 'slug',        title: 'URL Slug',         type: 'slug',    options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'description', title: 'Short Description',type: 'text',    rows: 3, validation: r => r.required().max(200) }),
    defineField({ name: 'cuisine',     title: 'Cuisine',          type: 'string',  description: 'e.g. North Indian, American, Italian-Indian Fusion' }),

    defineField({
      name: 'mainImage', title: 'Hero Image', type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    defineField({ name: 'prepTime', title: 'Prep Time (mins)', type: 'number', validation: r => r.required().min(0) }),
    defineField({ name: 'cookTime', title: 'Cook Time (mins)', type: 'number', validation: r => r.required().min(0) }),
    defineField({ name: 'servings', title: 'Servings',         type: 'number', validation: r => r.required().min(1) }),

    defineField({
      name: 'difficulty', title: 'Difficulty', type: 'string',
      options: { list: [{ title: 'Easy', value: 'Easy' }, { title: 'Medium', value: 'Medium' }, { title: 'Quick', value: 'Quick' }], layout: 'radio' },
      validation: r => r.required(),
    }),

    defineField({
      name: 'category', title: 'Category', type: 'string',
      options: {
        list: [
          { title: '🍛 Indian',         value: 'indian'    },
          { title: '🌅 Breakfast',      value: 'breakfast' },
          { title: '🥗 Salads & Bowls', value: 'salads'    },
          { title: '🫕 Soups',          value: 'soups'     },
          { title: '🌍 Global',         value: 'global'    },
          { title: '🥙 Snacks',         value: 'snacks'    },
        ],
      },
      validation: r => r.required(),
    }),

    defineField({
      name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }],
      options: {
        list: [
          { title: '⚡ Quick',        value: 'quick'        },
          { title: '🇮🇳 Indian',      value: 'indian'       },
          { title: '👧 Kid Friendly', value: 'kid-friendly' },
          { title: '🫕 One Pot',      value: 'one-pot'      },
          { title: 'Gluten Free',     value: 'gluten-free'  },
          { title: 'Dairy Free',      value: 'dairy-free'   },
          { title: '💪 High Protein', value: 'high-protein' },
        ],
        layout: 'grid',
      },
    }),

    defineField({
      name: 'ingredients', title: 'Ingredients', type: 'array',
      of: [{
        type: 'object', name: 'ingredient',
        fields: [
          defineField({ name: 'name',   title: 'Name',             type: 'string', validation: r => r.required() }),
          defineField({ name: 'amount', title: 'Amount',           type: 'string', validation: r => r.required() }),
          defineField({ name: 'notes',  title: 'Notes (optional)', type: 'string' }),
        ],
        preview: { select: { title: 'name', subtitle: 'amount' } },
      }],
    }),

    defineField({
      name: 'steps', title: 'Method Steps', type: 'array',
      of: [{
        type: 'object', name: 'step',
        fields: [
          defineField({ name: 'stepNumber',  title: 'Step #',     type: 'number', validation: r => r.required() }),
          defineField({ name: 'instruction', title: 'Instruction',type: 'text',   validation: r => r.required() }),
          defineField({ name: 'tip',         title: 'Chef Tip',   type: 'string' }),
        ],
        preview: {
          select: { title: 'stepNumber', subtitle: 'instruction' },
          prepare: (value: Record<string, any>): { title: string; subtitle: string } => {
            const title = value.title as number
            const subtitle = value.subtitle as string
            return { title: `Step ${title}`, subtitle }
          },
        },
      }],
    }),

    defineField({ name: 'isKidFriendly', title: 'Kid Friendly?',       type: 'boolean', description: 'Shows in Little Aromas section', initialValue: false }),
    defineField({ name: 'isFeatured',    title: 'Feature on Homepage?', type: 'boolean', description: 'Only one recipe at a time',       initialValue: false }),
  ],
})
