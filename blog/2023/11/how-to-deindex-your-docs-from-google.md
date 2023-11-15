---
title: How To De-index Your Docs From Google (And Then Fix It)
date: 2023-11-14T16:31:07.914
tags: post
layout: blog
snippet: For months I worked on reviving the search results for Camunda's version 7 documentation. Our docs weren't giving 0 results for most queries, but they weren't far off. I learned unexpected details about SEO (Search Engine Optimization) — especially Google's flavor of SEO. Eventually I fixed it, though I had my doubts along the way.
draft: false
---

<h2 id="the-introduction">1. The introduction</h2>

Software documentation is a critical element of developer experience. I don't believe this is a bold or disagreeable statement.

Think about how you engage with documentation. Occasionally, you know exactly what you're looking for — you could browse the documentation navigation to find the page you need. More often, you either don't know exactly what you're looking for, or you don't know where it lives in the documentation.

The majority of time you interact with documentation, you probably search for the help you need. That search might happen within the documentation site itself. It might happen in your favorite search engine. Wherever it happens, you expect to find helpful results to your search terms. If you don't find helpful results, you're likely to get stuck. Get stuck too many times, and you give up entirely. This is the nightmare of every tool built for developers.

Imagine the docs you most interact with. You know them reasonably well, but you've forgotten a detail that you know the docs can explain. Envision yourself searching for help on this topic. Imagine browsing the results for your query — and seeing....

> 0 results found.

Zero results??!! What??? You _know_ it's in there somewhere. (╯°□°)╯︵ ┻━┻

### The real-life story of de-indexing our docs

For months I worked on reviving the search results for [Camunda's version 7 documentation][c7-docs]. Our docs weren't giving 0 results for most queries, but they weren't far off. Known pertinent results were excluded consistently. Most of the results that came up were slightly related but not helpful.

Throughout this I learned unexpected details about SEO (Search Engine Optimization) — especially Google's flavor of SEO. In the end we were able to revive the massively deindexed content. I had my doubts that we'd get there.

### What to expect from this article

This article describes my journey through this problem of vanishing search results in the Camunda 7 (C7) docs. There are 5 parts:

1. [The introduction](#the-introduction). You're almost finished reading that.
2. [The disappearance](#the-disappearance).
3. [The investigation](#the-investigation).
4. [The resolution](#the-resolution).
5. [The recommendation](#the-recommendation).

That final fifth part is the payoff. If you're managing a documentation site, and unsure how to handle versioned documentation from an SEO perspective, and just looking for guidance, jump there. Most guidance for handling duplicate content in regards to SEO ignores one prime use case — versioned documentation. I hope this article fills that gap.

If you prefer a video format, I've posted [a summary of this experience on YouTube](https://www.youtube.com/watch?v=HJGxdj_8oJ8). It's told in a different way, but the message is the same.

<h2 id="the-disappearance">2. The disappearance</h2>

### Setting context

Camunda version 8 (C8) marked a significant change from version 7 (C7). While version 7 was intended for self-managed environments, version 8 is cloud-first. Both versions are still supported, [at least until 2027](https://docs.camunda.org/enterprise/announcement/#camunda-extended-support-offering).

The large differences in approaches and product features led us to rebuild the documentation for Camunda 8. C7 docs are hosted at [docs.camunda.org][c7-docs]; the version 8 documentation lives at [docs.camunda.io][c8-docs]. The two different sites are built with different tooling ([Hugo][hugo] vs [Docusaurus][docusaurus]).

My team, Developer Experience, manages the C8 docs; we _interact_ with the C7 docs, but we mostly try to leave them alone. Basically, we try to keep the lights on, and not much more. There are issues I'd love to fix in the C7 docs, like the fact that [they're tied to a very-specific very-old version of Hugo](https://github.com/camunda/camunda-docs-manual#installing-hugo). But it's not worth the ROI for us...and there are [so many other issues in the C8 docs](https://github.com/camunda/camunda-platform-docs/issues) that take priority.

This story is about the C7 docs. The ones that we try not to touch very much....unless something goes very very wrong with them.

#### Camunda 7 documentation details

The Camunda 7 product is currently on version 7.20. Each released version has its own documentation: [7.20][7-20], [7.19][7-19], [7.18][7-18], all the way down to [7.0][7-0]. There are also two non-numeric versions of the documentation: [latest][latest] (a mirror of whichever numeric version is latest), and [develop][develop] (in-progress documentation for the next release). That's `n+2` versions of the documentation, where `n` is the number of released numeric versions. The early versions were released over 8 years ago! There are a lot of docs.

Much of the documentation is duplicated across versions. For example, look how similar the "Introduction" page is between [version 7.4](https://docs.camunda.org/manual/7.4/introduction/) and [version 7.19](https://docs.camunda.org/manual/7.19/introduction/). There are a couple small differences, but probably 95% of the content has not changed, over 15 versions. As my 12yo would say, "foreshadowing...."

One other important detail — there is an in-site search for the C7 docs. Notably, it is built on a [programmable Google search engine](https://programmablesearchengine.google.com/about/). Basically, that means that the search functionality on the site is powered by Google. A search query entered into the C7 docs search box gives basically the same results as entering the query on google.com and filtering by `site:docs.camunda.org`. Again, "foreshadowing...."

### First report

At some point in 2021, the search experience on docs.camunda.org began to degrade. It was not sudden, or obvious. But search results became less helpful, and obvious hits on specific search queries began to disappear. A search for BPMN — a critical and core technology in the Camunda ecosystem, and definitely documented — returned zero helpful results. Since the in-site search is built on Google, the results were degraded both within the site, and directly from google.com.

[The community noticed](https://forum.camunda.io/t/camunda-docs-repo-search-is-not-working-as-expected/32044). I want to say we _heard_ them....but we didn't realize how bad it was, or how much it was affecting people. We thought these were one-off complaints. We didn't prioritize the work to fix the search experience.

In mid-2022, we heard from Camunda's support team. They emphasized the problem. Every day, they help Camunda users find the answers to their problems. The degrading search experience was making that much harder. As a result, every member of the support team had effectively built a [memory palace][memory-palace] of the C7 documentation structure. The only way for them to find content in our docs was _to already know where it existed_.

Upon this discovery, I wrapped up other on-going projects, and we shifted our focus to fixing the C7 search experience.

<h2 id="the-investigation">3. The investigation</h2>

### Finding answers in Google Search Console

Early in our investigation, we noticed something strange in the Google Search Console. Many of the docs for the current version were not indexed. They were filed under the category of ["Duplicate without user-selected canonical"][dupe-without-canonical] — meaning Google chose a different version of the page as canonical, and we didn't specify one with a `<link rel="canonical">` hint.

This sounded familiar to me. When I learned to program in Ruby, I spent a lot of time searching [ruby-doc.org](https://ruby-doc.org) for help. One thing I always found interesting was that I'd never get the latest version of the Ruby docs from my search. Searching Google for ["ruby array map"](https://www.google.com/search?q=ruby+array+map&oq=ruby+array+map) does return a result from ruby-doc.org relatively near the top. But it's for Ruby version 2.7.0, while latest Ruby is currently somewhere in the 3s.

Our situation was much worse, though. We weren't getting _any_ version in the results, let alone an older version.

Inspecting the older version pages in Google Search Console clearly revealed the reason. Our older version pages were excluded from the Google search index because they were ["Excluded by ‘noindex’ tag"][excluded-by-noindex].

Sure enough — our docs [had a check in them for the version being rendered][source-noindex-check], and if it wasn't the current version, a `<meta name="robots" content="noindex">` directive was applied to the page. We did this with the intention of convincing Google to index only the current version. Unfortunately, it did not have that effect.

#### Why we had zero search results

It was the combination of these two factors that caused Google to index very little of our content. We were telling Google explicitly not to index our older version pages with `noindex` directives; Google was choosing those older version pages as the canonical source, and therefore not indexing the latest version pages. 😅😬

This set me on a learning adventure. To me, it's obvious that in a documentation site, the latest version page is probably the one I want to find in a search. Why doesn't Google think that? And really, how does Google (and any other search engine) handle duplicate content?

### How search engines handle duplicate content

Duplicate content happens all the time on the internet. Sometimes it's malicious (cue a generative AI ethics discussion), usually it's not. The usual example is a product page that can live in multiple categories, e.g. `/tops/cowboy-shirt` and `/western-wear/cowboy-shirt`.

We don't usually see the same page multiple times in search results, because a search engine chooses one as the canonical source. [The canonical is chosen based on many factors][how-google-chooses-canonical] -- which page is linked most by the rest of the internet, which page is referenced in a sitemap, etc. Website owners can even suggest a recommendation for a page's canonical URL, via a [`link rel=canonical` hint][link-rel-canonical].

I say "hint" because that's all `link rel=canonical` is. Google might, and in my experience often does, choose a different canonical than you specify. It's interpreting a collective story about your page from many different sources. Sometimes, it just doesn't agree with your suggestion — the rest of the internet convinces it to choose a different canonical.

Our docs weren't doing much to help Google interpret the collective story. We thought we were giving directives about canonicals by applying `noindex` to the old versions, but the `noindex` was applied separately from the choice of canonicals. We weren't submitting sitemaps with the true canonicals — in fact, we didn't even have sitemaps that were properly formed. It was basically 100% up to Google to figure out which version was canonical, without any of our input.

<h2 id="the-resolution">4. The resolution</h2>

We tried a lot of different things to convince Google to index the most recent version of our documentation. Not many of our attempts seemed to work!

And the feedback loop for each of them was horribly long! I'd experiment with something, and then wait weeks to see what happened. Even then, it was hard to tell if something worked. It was more obvious if it definitely _didn't_ work.

### Submitting a correct sitemap...unsuccessfully

When we realized Google wasn't working off of a sitemap, we went to submit ours, figuring it would be useful as a signal to Google about canonicals. It was rejected 😜 for being in an improper format. I wondered how long it had been in that state...

We corrected the sitemap's format. Our docs have a redirect rule set up so that if you visit a page _without_ a version in the URL, it will redirect to the latest version of that page. We tried submitting [a sitemap with these versionless redirecting URLs][sitemap-versionless-redirecting] — no significant change was affected.

We tried a sitemap with the latest version hardcoded in the URLs. This had a more positive effect than the redirecting versionless URLs, but still not very significant.

### Declaring canonicals...unsuccessfully

We shifted our focus to declaring canonicals via [`link rel=canonical`][link-rel-canonical]. Since we have so many versions of documentation, we ran these experiments on only a few pages at a time, or sometimes an entire version at a time.

We started with [pointing canonicals of the current version at the redirecting versionless URLs][canonicals-redirecting-versionless]. We wanted to use the redirecting URLs so that we would never have to go back and change them. Google was unconvinced, and maintained its own opinion, usually canonicalizing an older version of the page. We also got new errors from the redirecting versionless URLs, about [containing a redirect][not-indexed-redirect].

We tried [using self-referential canonicals in the current version][canonicals-latest], and submitting the current sitemap. This had no effect.

Nothing happened when we applied the current version canonicals [to older version pages][canonicals-older], either. Because our older version pages still said `noindex`, Google wouldn't even bother to look at the canonical link. These pages remained canonical, but also de-indexed.

We also experimented with the sequencing of our submissions to Google's crawler. Would it make a difference if we submitted an older page first, then re-submitted a current version page? If we submitted an entire sitemap vs an individual page?

Sadly, no. Occasionally something good would happen, but results were not repeatable or predictable. It seemed like there was nothing we could do to convince Google to consistently choose our latest version docs as canonical. Each experiment took weeks to play out, and it was frustrating.

### Building a comprehensive story...and waiting

We noticed that Google was doing a lot more crawling of our docs when we released a new version, and a flood of new pages came online. Given what we'd learned about how search engines choose a canonical source — by piecing together clues from a website _and_ the rest of the internet — we decided to take one final half-court shot.

In a few months, we'd release version 7.19, and Google would crawl it thoroughly. If we could put together a comprehensive story, with correct canonicals on most versions, and an accurate sitemap, maybe this flurry of crawling activity would convince it to canonicalize and index the correct versions.

We weren't sure what to do about the `noindex` situation. My opinion was that the story would be more comprehensive with the older versions **not** `noindex`ed. We ran [an experiment][noindex-experiment-definition] to see if there was a positive effect on canonicals when I removed `noindex`. [There was no positive effect][noindex-experiment-results]. We decided to leave all older versions marked as `noindex`.

Months later, when we released our next version [(7.19)][7-19], we submitted a sitemap containing only the 7.19 pages, and crossed our fingers. And waited again.

### Success!

Over the next few months, we received a couple notes from our support team that suggested things had improved.

![A message in Slack: "I completely forgot that C7 doc search works again. I just tried it and ... IT ACTUALLY WORKS!"](../it-worked.png)

Eventually I logged into Google Search Console to see if things had improved. It not only had improved, but it had improved **remarkably**.

[90% of our 7.19 pages were indexed][results-initial-success]! I checked back later, and [all but 4 of 500 pages were indexed][results-later-success]. Google finally agrees with us! Current version pages are canonical. And more importantly, you get accurate results again when searching our docs.

<h2 id="the-recommendation">5. The recommendation</h2>

Whew, the payoff! So you've got a documentation site, with duplicate content across versions. You don't want to re-live our awful experience of de-indexing your docs. What should you do?

### Build a cohesive picture about the canonical source.

There's no one thing that resolved our situation. Search engines take a wholistic look at your website, and you need to make sure every version is telling a consistent story. [Hints and signals compound](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). The more comprehensive story you tell, the more likely search engines are to agree with your canonical suggestions.

More specifically, in our experience that means:

1. Use `link rel=canonical` tags on all older version documents, pointed at the current version.
2. Submit a sitemap that contains absolute URLs of only the current version of documents.

There's not much there, but any slight deviation can cause havoc.

### Some other important notes

- `link rel=canonical` is only a suggestion!

  It is definitely important to specify canonicals, but they aren't a guarantee. Search engines might very well choose a different page if the comprehensive story suggests your preferred canonical is incorrect.

- Self-referential canonicals are probably not helpful.

  [The only time they're helpful is when the visited URL doesn't match the canonical URL](https://www.youtube.com/watch?v=TepFVYrBVg0&t=968s). If links to your docs include query-string parameters for tracking, they might be helpful. That's not how we use our docs, so declaring a self-referential canonical would give a search engine as much information as declaring _no_ canonical.

- Probably don't use `noindex`.

  This is straying a bit from science, as my experimentation suggested that removing the `noindex` tag from our older versions was actually detrimental to our situation. But hear me out.

  1.  All of my results at the time I ran that experiment were confusing, inconsistent, and reliable. I think removing `noindex` before The Big Recrawl (when we released a new version) would have also resulted in strong canonicalization success.
  2.  Google recommends that [you _don't_ use `noindex` to prevent canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls):

      > We don't recommend using noindex to prevent selection of a canonical page within a single site, because it will completely block the page from Search. rel="canonical" link annotations are the preferred solution.

  3.  Returning to my [Ruby docs](https://ruby-doc.org) example from earlier — they have canonicalization problems, but their problems are way less severe than ours were. If we were indexing our old versions, our search wouldn't have broken. It would have served old versions for search results, but that's a much better situation for a stuck user than _zero_ results.

## Epic conclusion

This was the classic ambiguous and confusing software problem. The system was broken, and there was very little help pinpointing why. There are no examples on the internet about how to handle content duplication in versioned documentation. The horribly loose feedback loop when making changes, the unpredictability and inconsistency of canonical selection, it just all felt like I was powerless and guessing. As I got deeper into it, it became something I couldn't _not_ solve. It haunted me a little. I had basically exhausted our appetite to figure it out when we took our final half-court shot. I'm glad it worked out, because that was probably my last attempt before saying "🤷🏼 sorry it just doesn't work."

[c7-docs]: https://docs.camunda.org/
[c8-docs]: https://docs.camunda.io/
[7-0]: https://docs.camunda.org/manual/7.0/
[7-18]: https://docs.camunda.org/manual/7.18/
[7-19]: https://docs.camunda.org/manual/7.19/
[7-20]: https://docs.camunda.org/manual/7.20/
[latest]: https://docs.camunda.org/manual/latest/
[develop]: https://docs.camunda.org/manual/develop/
[hugo]: https://gohugo.io/
[docusaurus]: https://docusaurus.io/
[memory-palace]: https://en.wikipedia.org/wiki/Method_of_loci
[dupe-without-canonical]: https://support.google.com/webmasters/answer/7440203#duplicate_page_without_canonical_tag
[excluded-by-noindex]: https://support.google.com/webmasters/answer/7440203#submitted_but_noindex
[source-noindex-check]: https://github.com/camunda/camunda-docs-manual/blob/master/themes/camunda/layouts/partials/header.html#L24-L26
[how-google-chooses-canonical]: https://developers.google.com/search/docs/crawling-indexing/canonicalization#canonical-how
[link-rel-canonical]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#rel-canonical-link-method
[sitemap-versionless-redirecting]: https://github.com/camunda/camunda-docs-manual/pull/1345
[link-rel-canonical]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#rel-canonical-link-method
[canonicals-redirecting-versionless]: https://github.com/camunda/camunda-docs-manual/pull/1345
[not-indexed-redirect]: https://support.google.com/webmasters/answer/7440203#page_with_redirect
[canonicals-latest]: https://github.com/camunda/camunda-docs-manual/pull/1361
[canonicals-older]: https://github.com/camunda/camunda-docs-manual/pull/1370
[noindex-experiment-definition]: https://gist.github.com/pepopowitz/c0c9bc63bd50318f54a17e19fd9788f5
[noindex-experiment-results]: https://gist.github.com/pepopowitz/f672e1d2bef12ad2adf7cb70e261fe38
[results-initial-success]: https://gist.github.com/pepopowitz/cbda099efb429a904369398fb107c480
[results-later-success]: https://gist.github.com/pepopowitz/64ff0c6d19c56f328531ec6cfc582807
