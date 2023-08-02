import axios from 'axios';

export default async function fetchImages(q, page) {
  try {
    const response = await axios({
      url: `https://pixabay.com/api/`,
      params: {
        key: '28351451-92068ca5a052609c75a292b60',
        q: q,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
}
