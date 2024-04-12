---
title: How Camunda Docs Handle Canonicals
date: 2024-04-12T17:15:27.669
tags: post
layout: blog
snippet: Out of the box, Docusaurus handles canonical URLs in a potentially SEO-damaging way. Here's how we fixed it for the Camunda 8 documentation.
tagline: Out of the box, Docusaurus handles canonical URLs in a potentially SEO-damaging way. Here's how we fixed it for the Camunda 8 documentation.
---

By default, Docusaurus applies a self-referential canonical to every page. According to John Mueller, SEO advocate from Google, [truly self-referential canonicals "do nothing"](youtube.com/watch?v=TepFVYrBVg0&t=968s). If the visited URL is different from the canonical, in which case it isn't truly self-referential, _then_ it can be helpful. Query string parameters are a typical use case where the visited URL doesn't match a self-referential canonical.

In our versioned documentation, we don't use query string parameters, and every self-referential canonical is _truly_ self-referential. This does nothing to help search engines identify the canonical version of your documentation, and from my experiences [solving SEO problems with the Camunda 7 docs](/blog/2023/11/how-to-deindex-your-docs-from-google/), this can potentially nudge search engines to select old versions of documentation as canonical.

Docusaurus also claims to offer the ability to specify a canonical URL in the frontmatter of a page, but at the time of my investigation I found this to be non-functional.

## Our solution

The solution we've settled on is more complex behind the scenes, but not complex to use. For each document, we look for a frontmatter declaration of the canonical document. If that is specified, we look for that document and construct a canonical URL for it. If it isn't specified, we inspect all versions of the documentation for the newest document with the same path as the one being rendered. I think of each doc as being in a stack, with the top of the stack being the newest version of the document, or the newest version before it was moved somewhere else. Each version of the stack below the top will point a canonical reference at the document on top of the stack.

Here are some links to help you dig deeper into our approach:

- [Guide for specifying canonical sources in our docs](https://github.com/camunda/camunda-docs/blob/main/howtos/moving-content.md#canonical-references).
- [How our system identifies a canonical source](https://github.com/camunda/camunda-docs/blob/main/howtos/moving-content.md#how-our-system-identifies-a-canonical-reference-for-every-page)
- [Unit tests describing the canonical identification logic](https://github.com/camunda/camunda-docs/blob/main/src/theme/DocItem/Metadata/determineCanonical.spec.js).
- [All the code you need to handle canonicals like the Camunda docs do](https://github.com/camunda/camunda-docs/tree/main/src/theme/DocItem/Metadata).

- Pull requests:
  - [Initial implementation of the canonical logic](https://github.com/camunda/camunda-docs/pull/2577). Warning, it contains a regular expression that crashes in Safari!
  - [Fixing the crashing regular expression](https://github.com/camunda/camunda-docs/pull/2654). Again, this one is still not correct, and spams the build output!
  - [Fixing the regular expression for good](https://github.com/camunda/camunda-docs/pull/3192).
