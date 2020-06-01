// CHANGE ONLY THESE VARIABLES
const place = "Setubal";

// KEEP THIS CODE UNCHANGED

// DEPENDENCIES
const rp = require("request-promise");
const $ = require("cheerio");
const { performance } = require("perf_hooks");

// HELPER FUNCTIONS
/**
 * url - function that generates the url
 *
 * @param  {Integer} index page index required to generate this url
 * @return {String}  complete url
 */
const url = function(index) {
  return `https://www.codigo-postal.pt/${place.toLowerCase()}/${index}.html`;
};

/**
 * percent - Function that returns the percentage of pages scraped
 *
 * @param  {Integer} index page index
 * @param  {Integer} total total of pages
 * @return {String} Percentage of pages scraped
 */
const percent = function(index, total) {
  return Math.round((index / total) * 100);
};

/**
 * executionTime - displays how long it took to run this function
 *
 * @param  {Integer} t0
 * @param  {Integer} t1
 * @return {String}
 */
const executionTime = function(t0, t1) {
  return t1 - t0 + " milliseconds.";
};

/**
 * main - the core function
 *
 * @return {Void}  description
 */
async function main() {
  try {
    const t0 = performance.now();
    const postCodes = [];

    // CHECK HOW MANY PAGES WE HAVE TO SCRAPE
    const html = await rp(url(1));
    const pages = parseInt(
      $(".pagination-totals", html)[0].children[0].data.replace(
        "Página 1 de ",
        ""
      )
    );

    // OPEN EACH PAGE AND GET THE POSTCODES DISPLAYED ON IT
    for (let i = 1; i < pages; i++) {
      console.log(
        `Scraping page ${i} of ${pages}. ${percent(i, pages)}% Complete`
      );
      const page = await rp(url(i));

      // GET POSTCODES
      $(".cp", page).each(function(index, element) {
        element.children.forEach(child => {
          const postCode = child.data;
          if (postCodes.indexOf(postCode) === -1) postCodes.push(postCode);
        });
      });
    }

    // track performance
    const t1 = performance.now();

    // DISPLAY RESULTS
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(
      `Scraping complete in ${executionTime(t0, t1)}. ${
        postCodes.length
      } results were found.`
    );
    console.log(" ");
    console.log(`Post Codes List For ${place}:`);
    console.log(" ");
    console.log(postCodes.toString());
  } catch (ex) {
    console.warn(ex);
    console.warn(
      "Something went wrong, please contact Pihh if this error persists."
    );
  }
}

main();
