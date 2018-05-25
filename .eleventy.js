const { DateTime } = require('luxon');

function dateToISO(str) {
  return DateTime.fromJSDate(str).toISO({
    includeOffset: true,
    suppressMilliseconds: true,
  });
}

// .eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection('postsReversed', function(collection) {
    return collection
      .getFilteredByTag('post')
      .filter(x => x.data.draft !== true)
      .reverse()
      .map(item => ({
        ...item,
        isoDate: dateToISO(item.date),
      }));
  });
  eleventyConfig.addCollection('engagementsReversed', function(collection) {
    return collection
      .getFilteredByTag('engagements')
      .reverse()
      .map(item => ({
        ...item,
        isoDate: dateToISO(item.date),
      }));
  });
  eleventyConfig.addPassthroughCopy('_redirects');
  return {
    templateFormats: ['md', 'pug', 'njk', 'png', 'jpg', 'gif', 'css', 'ico'],
    passthroughFileCopy: true,
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    nunjucksFilters: {
      lastUpdatedDate: collection => {
        // Newest date in the collection
        return dateToISO(collection[collection.length - 1].date);
      },
      rssDate: dateObj => {
        return dateToISO(dateObj);
      },

      url: url => {
        // If your blog lives in a subdirectory, change this:
        let rootDir = '/blog/';
        if (!url || url === '/') {
          return rootDir;
        }
        return rootDir + url;
      },
    },
  };
};
