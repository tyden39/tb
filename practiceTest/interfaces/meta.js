export const getMetaData = (title, description, image) => {
  return {
    title: title,
    favicon: '/favicon.ico',
    metaData: [
      { name: 'description', content: description },
      { name: 'robots', content: 'noindex' },
      { name: 'language', content: 'En, Vi' },
      {
        name: 'geo.position',
        content: '10.796264157099658, 106.67601135801247',
      },
      { name: 'geo.placename', content: 'DAI TRUONG PHAT EDUCATION JSC' },
      { name: 'geo.region', content: 'VN-SG' },
      { name: 'keywords', content: title },
    ],
    social: {
      schema: [
        { itemProp: 'name', content: title },
        { itemProp: 'description', content: description },
        {
          itemProp: 'image',
          content: image,
        },
      ],
      openGraph: [
        { property: 'og:title', content: title },
        { property: 'og:type', content: 'Article' },
        { property: 'og:url', content: '' },
        {
          property: 'og:image',
          content: image,
        },
        { property: 'og:description', content: description },
        { property: 'og:site_name', content: title },
        { property: 'og:amount', content: '45000' },
        { property: 'og:currency', content: 'VND' },
      ],
    },
  }
}
