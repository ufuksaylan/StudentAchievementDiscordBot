import 'dotenv/config';
import axios from 'axios';

const GIPHY_API_KEY = process.env.GIPHY_API_KEY!;
const GIPHY_SEARCH_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';

export default async function getRandomCongratulatoryGif(): Promise<
  string | null
> {
  try {
    const randomOffset = Math.floor(Math.random() * 5000);
    const response = await axios.get(GIPHY_SEARCH_ENDPOINT, {
      params: {
        api_key: GIPHY_API_KEY,
        q: 'congratulations',
        limit: 1,
        rating: 'g',
        offset: randomOffset,
      },
    });

    const data = response.data;
    if (data.data && data.data.length > 0) {
      // Extract the gif URL from the response
      const gifUrl = data.data[0].images.original.url;
      return gifUrl;
    } else {
      console.error('No gifs found');
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching gif:', error.message);
    return null;
  }
}
