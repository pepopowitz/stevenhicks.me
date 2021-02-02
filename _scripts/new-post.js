const fs = require('fs-extra');
const { DateTime } = require('luxon');

const name = process.argv.slice(2)[0];

if (name === undefined) {
  console.log('please provide a name for the post. example:');
  console.log('   `yarn post:new lowering-the-bar`');
  return;
}

const now = DateTime.local();
const year = now.year;
const month = now.toFormat('LL');
const nowISO = now.toISO({
  includeOffset: false,
  suppressMilliseconds: true,
});

const filepath = `./blog/${year}/${month}/${name}.md`;

const contents = `---
title: ${name}
date: ${nowISO}
tags: post
layout: blog
snippet: The one that shows on the homepage
tagline: The one that shows at the top of the post
draft: true
---
`;

fs.outputFile(filepath, contents);
