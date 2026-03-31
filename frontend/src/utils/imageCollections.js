export const getImageCollection = (item) => {
  const images = Array.isArray(item?.images) ? item.images.filter(Boolean) : []

  if (images.length > 0) {
    return images
  }

  return item?.image ? [item.image] : []
}

export const normalizeImageCollection = (item) => {
  const images = getImageCollection(item)

  return {
    ...item,
    images,
    image: images[0] || null,
  }
}
