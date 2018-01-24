---
title: Static Site Generators Are The New WordPress
date: 2016-03-10T12:00:00
layout: article.pug
tags: post
snippet: I recently presented at MKE Web Pros, about static site generators. I put together some slides and notes.
url: blog/2016/03/staticgen
---

## Static Site Generators Are The New WordPress

I recently presented at the MKE Web Pros meetup group, about static site generators, and how you can build stupid simple websites with them.

### Summary

The dynamic CMS like WordPress is no longer the defacto answer to the statement "I need a website". Static site generation can easily handle the needs of simple sites with infrequently changing content. Services are becoming more prevalent for adding interactive functionality to an otherwise static site - for example, Disqus for comments. And in many cases, where services can't be dropped directly onto your static site, a little technical courage and some javascript can get you what you need.

Statically generated sites are much more performant and secure than a site run on a dynamic CMS. There are fewer moving parts, and since your content is literally served as static html files, fewer ways your site can be attacked.

I would love to say static site generation is the answer for all sites. But it's not quite ready for your non-technical relative's site. Until content editing is more user-friendly, static site generation is probably only for your simplest sites or your most technical friends' websites. As a general rule, if the content editor is not capable or ready to write content using a language like Markdown, static site generation might not be the answer.

The good news is, we're headed toward a future where even your non-technical relative can publish content on a statically generated site. Services like Contentful and CloudCannon and plugins like Netlify-CMS are pushing in that direction. I don't think we're too far from a future where your non-technical relative can edit content in a WYSIWYG editor, click a button, and push changes to their statically generated site.

Check out [staticgen.com](http://www.staticgen.com) to get started with static site generation. There are way too many generators for me to recommend "the perfect one". It is up to you to determine which generator works best for your scenario. For me, the answer is either HarpJs or Metalsmith. For you, the answer could be anything. Find the static generator for you, and let's start moving the web to a more performant and less vulnerable place.
