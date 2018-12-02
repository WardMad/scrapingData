const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const writeToFile = fs.createWriteStream('data.json')


const list_url_1 = 'https://www.engelvoelkers.com/en/search/?q=&startIndex=0&businessArea=residential&sortOrder=DESC&sortField=newestProfileCreationTimestamp&pageSize=18&facets=bsnssr%3Aresidential%3Bcntry%3Abelgium%3Bobjcttyp%3Ahouse%3Brgn%3Aanvers%3Btyp%3Abuy%3B';
const list_url_2 = 'https://www.engelvoelkers.com/en/search/?q=&startIndex=16&businessArea=residential&sortOrder=DESC&sortField=newestProfileCreationTimestamp&pageSize=18&facets=bsnssr%3Aresidential%3Bcntry%3Abelgium%3Bobjcttyp%3Ahouse%3Brgn%3Aanvers%3Btyp%3Abuy%3B';
const list_url_3 = 'https://www.engelvoelkers.com/en/search/?q=&startIndex=34&businessArea=residential&sortOrder=DESC&sortField=newestProfileCreationTimestamp&pageSize=18&facets=bsnssr%3Aresidential%3Bcntry%3Abelgium%3Bobjcttyp%3Ahouse%3Brgn%3Aanvers%3Btyp%3Abuy%3B';
const list_url_4 = 'https://www.engelvoelkers.com/en/search/?q=&startIndex=52&businessArea=residential&sortOrder=DESC&sortField=newestProfileCreationTimestamp&pageSize=18&facets=bsnssr%3Aresidential%3Bcntry%3Abelgium%3Bobjcttyp%3Ahouse%3Brgn%3Aanvers%3Btyp%3Abuy%3B'
const list_url_5 = 'https://www.engelvoelkers.com/en/search/?q=&startIndex=70&businessArea=residential&sortOrder=DESC&sortField=newestProfileCreationTimestamp&pageSize=18&facets=bsnssr%3Aresidential%3Bcntry%3Abelgium%3Bobjcttyp%3Ahouse%3Brgn%3Aanvers%3Btyp%3Abuy%3B'

request(list_url_5, (error, response, html) => {

  const $ = cheerio.load(html)

  const parentDivSelector = $('.ev-teaser-content');
  const housePropsSelector = $('.ev-teaser-attributes');
  const addressSelector = $('.ev-teaser-subtitle');
  const priceSelector = $('.ev-value');

  let housesInfo = []

  for (let i = 0; i < parentDivSelector.length; i++) {

    let items = $($(housePropsSelector)[i]).children();

    let adresEl = $((addressSelector)[i]);
    let priceEl = $($(priceSelector)[i]);

    let address = $(adresEl).text();
    let price = $(priceEl).text();

    console.log(
      'Rooms  ' + ($(items[0]).text()),
      'Bathroom  ' + ($(items[1]).text()),
      'Square ' + $(items[2]).text(),
      'Parcel ' + $(items[3]).text(),
      'Address ' + address,
      '\nPrice ' + price
    );

    let obj = {
      'Rooms ': ($(items[0]).text()),
      'Bathroom ': ($(items[1]).text()),
      'Square ': $(items[2]).text(),
      'Parcel ': $(items[3]).text(),
      'Address ': address,
      'Price ': price
    };
    housesInfo.push(obj);
  }
  writeToFile.write(JSON.stringify(housesInfo))
});
