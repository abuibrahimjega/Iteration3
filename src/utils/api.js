// src/utils/api.js
export const fetchWithRetry = async (
  url,
  options = {},
  retries = 3,
  backoff = 300
) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries === 0) {
      throw error;
    }

    console.log(
      `Retrying fetch to ${url} in ${backoff}ms... (${retries} retries left)`
    );

    // Wait for backoff period
    await new Promise((resolve) => setTimeout(resolve, backoff));

    // Exponential backoff
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
};
