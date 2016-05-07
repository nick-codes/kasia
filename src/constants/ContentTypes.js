import Plurality from './Plurality'
import { Slugs } from './WpApiEndpoints'

const ContentTypes = {
  CATEGORY: 'CATEGORY',
  COMMENT: 'COMMENT',
  MEDIA: 'MEDIA',
  PAGE: 'PAGE',
  POST: 'POST',
  POST_REVISION: 'POST_REVISION',
  POST_TYPE: 'POST_TYPE',
  POST_STATUS: 'POST_STATUS',
  TAG: 'TAG',
  TAXONOMY: 'TAXONOMY',
  USER: 'USER'
}

export default ContentTypes

export const ContentTypeOptions = Object.keys(ContentTypes)
  .reduce((obj, contentType) => {
    obj[contentType] = {
      slug: Slugs[contentType],
      name: {
        canonical: contentType,
        [Plurality.SINGULAR]: mapToCamelCaseSingular(contentType),
        [Plurality.PLURAL]: mapToCamelCasePlural(contentType)
      }
    }
    return obj
  }, {})

function mapToCamelCaseSingular (contentType) {
  return {
    [ContentTypes.CATEGORY]: 'category',
    [ContentTypes.COMMENT]: 'comment',
    [ContentTypes.MEDIA]: 'media',
    [ContentTypes.PAGE]: 'page',
    [ContentTypes.POST]: 'post',
    [ContentTypes.POST_REVISION]: 'postRevision',
    [ContentTypes.POST_TYPE]: 'postType',
    [ContentTypes.POST_STATUS]: 'postStatus',
    [ContentTypes.TAG]: 'tag',
    [ContentTypes.TAXONOMY]: 'taxonomy',
    [ContentTypes.USER]: 'user'
  }[contentType]
}

function mapToCamelCasePlural (contentType) {
  return {
    [ContentTypes.CATEGORY]: 'categories',
    [ContentTypes.COMMENT]: 'comments',
    [ContentTypes.MEDIA]: 'media',
    [ContentTypes.PAGE]: 'pages',
    [ContentTypes.POST]: 'posts',
    [ContentTypes.POST_REVISION]: 'postRevisions',
    [ContentTypes.POST_TYPE]: 'postTypes',
    [ContentTypes.POST_STATUS]: 'postStatuses',
    [ContentTypes.TAG]: 'tags',
    [ContentTypes.TAXONOMY]: 'taxonomies',
    [ContentTypes.USER]: 'users'
  }[contentType]
}
