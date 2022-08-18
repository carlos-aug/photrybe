export const fetchPhotos = async (searchTerm) => {
  const header = {
    headers: { Authorization: 'Client-ID xaCqrDBwdW22RHRVuI59lZSeujvhFaBdqyN0onbbRkU' }
  }
  const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchTerm}`, header);
  const data = await response.json();
  return data.results;
}