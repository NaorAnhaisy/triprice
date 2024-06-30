import { load } from 'cheerio';
import axios from 'axios';

export interface imageData {
  index: number,
  title: string,
  source: string,
  link: string,
  original: string,
  thumbnail: string
};

export const getImagesData = async (searchTerm: string, numberOfImages: number): Promise<imageData[]> => {
  /**
   * One User Agent might not be enough as Google can block our request.
   * So, we will make an array of User Agents and select a random one on every request.
   * @returns user agent string
   */
  const selectRandomUserAgent = () => {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    ];
    const randomNumber = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomNumber];
  };

  const userAgent = selectRandomUserAgent();
  const header = {
    "User-Agent": `${userAgent}`,
  };

  const response = await axios.get(
    `https://www.google.com/search?q=${searchTerm}&oq=${searchTerm}&hl=en&tbm=isch&asearch=ichunk&async=_id:rg_s,_pms:s,_fmt:pc&sourceid=chrome&ie=UTF-8`,
    {
      headers: header
    }
  );

  if (response?.data) {
    const $ = load(response.data);
    const imagesResults = [];
    $("div.rg_bx").each((i, el) => {
      const json_string = $(el).find(".rg_meta").text();
      imagesResults.push({
        index: i,
        title: $(el).find(".iKjWAf .mVDMnf").text(),
        source: $(el).find(".iKjWAf .FnqxG").text(),
        link: JSON.parse(json_string).ru,
        original: JSON.parse(json_string).ou,
        thumbnail: $(el).find(".rg_l img").attr("src") ? $(el).find(".rg_l img").attr("src") : $(el).find(".rg_l img").attr("data-src"),
      });
    });

    const slicedImagesResults = imagesResults?.slice(0, numberOfImages);
    return slicedImagesResults;
  }

  return [];
};
