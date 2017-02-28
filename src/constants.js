// The WP-API's own namespace (`wp-json/${namespace}`)
export const WpApiNamespace = 'wp/v2'

// Built-in content types available in WordPress.
export const ContentTypes = {
  Category: 'category',
  Comment: 'comment',
  Media: 'media',
  Page: 'page',
  Post: 'post',
  PostStatus: 'status',
  PostType: 'type',
  PostRevision: 'revision',
  Tag: 'tag',
  Taxonomy: 'taxonomy',
  User: 'user'
}

// Plural names of the built-in content types.
export const ContentTypesPlural = {
  [ContentTypes.Category]: 'categories',
  [ContentTypes.Comment]: 'comments',
  [ContentTypes.Media]: 'media',
  [ContentTypes.Page]: 'pages',
  [ContentTypes.Post]: 'posts',
  [ContentTypes.PostStatus]: 'statuses',
  [ContentTypes.PostType]: 'types',
  [ContentTypes.PostRevision]: 'revisions',
  [ContentTypes.Tag]: 'tags',
  [ContentTypes.Taxonomy]: 'taxonomies',
  [ContentTypes.User]: 'users'
}

// These content types do not have `id` properties.
export const ContentTypesWithoutId = [
  ContentTypes.Category,
  ContentTypes.PostType,
  ContentTypes.PostStatus,
  ContentTypes.Taxonomy
]
