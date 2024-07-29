"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
  if(!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $('#track_details').text().trim();
    // const currentPrice = extractPrice(
    //   $('div:nth-child(7) > label'),
    //   $('div:nth-child(3) > label'),
    //   $('div:nth-child(7) > label'),
    // );

    // const originalPrice = extractPrice(
    //   $('div:nth-child(7) > label'),
    //   $('div:nth-child(7) > label'),
    //   $('div:nth-child(7) > label'),
    //   $('div:nth-child(7) > label'),
    //   $('div:nth-child(7) > label')
    // );

    // const outOfStock = $('div:nth-child(7) > label').text().trim().toLowerCase() === 'currently unavailable';

    const images = 
      $('div:nth-child(4) > a > img').attr('data-a-dynamic-image') || 
      $('div:nth-child(5) > a > img').attr('data-a-dynamic-image') ||
      '{}'

    const imageUrls = Object.keys(JSON.parse(images));

    // const currency = extractCurrency($('.a-price-symbol'))
    // const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    // const description = extractDescription($)

    // Construct data object with scraped information
    const data = {
      url,
      // currency: currency || '$',
      image: imageUrls[0],
      title,
      // currentPrice: Number(currentPrice) || Number(originalPrice),
      // originalPrice: Number(originalPrice) || Number(currentPrice),
      // priceHistory: [],
      // discountRate: Number(discountRate),
      // category: 'category',
      // reviewsCount:100,
      // stars: 4.5,
      // isOutOfStock: outOfStock,
      // description,
      // lowestPrice: Number(currentPrice) || Number(originalPrice),
      // highestPrice: Number(originalPrice) || Number(currentPrice),
      // averagePrice: Number(currentPrice) || Number(originalPrice),
    }

    return data;
  } catch (error: any) {
    console.log(error);
  }
}