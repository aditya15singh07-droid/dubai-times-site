export const optimizedImage = (src: string) => {
  if (!src.includes("images.pexels.com")) return src;
  return `/api/image?src=${encodeURIComponent(src)}`;
};
