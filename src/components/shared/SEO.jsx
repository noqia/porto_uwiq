import { Helmet } from 'react-helmet-async'

export const SEO = ({ title, description, image, type = 'website' }) => {
  const siteTitle = 'StoryVerse - Creative Writer Portfolio'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  )
}