const { DateTime } = require('luxon');

function dateToISO(str) {
  return DateTime.fromJSDate(str).toISO({
    includeOffset: true,
    suppressMilliseconds: true,
  });
}

// .eleventy.js
module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    'md',
    'pug',
    'njk',
    'png',
    'jpg',
    'gif',
    'css',
    'ico',
  ]);
  eleventyConfig.addCollection('postsReversed', function (collection) {
    return collection
      .getFilteredByTag('post')
      .filter((x) => x.data.draft !== true)
      .reverse();
  });
  eleventyConfig.addCollection('tweetablePostsReversed', function (collection) {
    return collection
      .getFilteredByTags('post')
      .filter((x) => !!x.data.tweet)
      .filter((x) => x.data.draft !== true)
      .reverse();
  });
  eleventyConfig.addCollection('engagementsReversed', function (collection) {
    return collection.getFilteredByTag('engagements').reverse();
  });
  eleventyConfig.addPassthroughCopy('_redirects');
  return {
    passthroughFileCopy: true,
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    nunjucksFilters: {
      formatDate: (dateString) => {
        const date = new Date(dateString);
        const d = date.getDate();
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const m = monthNames[date.getMonth()];
        const y = date.getFullYear();
        return m + ' ' + d + ', ' + y;
      },
      lastUpdatedDate: (collection) => {
        if (collection.length === 0) {
          return;
        }
        // Newest date in the collection
        dates = collection.map((x) => x.date);
        latest = dates.sort((a, b) => b - a)[0];
        return dateToISO(latest);
      },
      rssDate: (dateObj) => {
        return dateToISO(dateObj);
      },

      url: (url) => {
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
