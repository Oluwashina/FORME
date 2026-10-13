/** Unsplash CDN helpers (images served via images.unsplash.com with on-the-fly resizing). */
export const photoUrl = (id: string, width: number, quality = 72) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`

export const photoSrcSet = (id: string, widths: number[] = [360, 540, 800, 1200, 1800]) =>
  widths.map((w) => `${photoUrl(id, w)} ${w}w`).join(', ')
