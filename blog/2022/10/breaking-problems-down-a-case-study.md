---
title: 'Breaking Problems Down: A Case Study'
date: 2022-10-21T16:42:18.795
tags: post
layout: blog
snippet: "I've written in the past about breaking problems down in the abstract. For the last couple months I've worked on a project where I can demonstrate it in real life!"
---

I've written in the past about [strategies for breaking Pull Requests (PRs) into smaller pieces](https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/). In that article I give a number of recommendations for reducing the size of a PR....but it's still very abstract.

For the last couple months I've been working on a large-ish project for the [Camunda Platform 8 documentation][c8-docs]. The size of the project has forced me to practice what I preach. It involves moving _a lot_ of content, which could easily have turned into massive PRs, and left overwhelmed reviewers with no choice but to rubber stamp "LGTM" (looks good to me) on them. I've also worked in relative isolation on this project, and since I'm much deeper into the work than my reviewers, easily-digested PRs are an absolute requirement.

So consider this article almost an addendum to [my previous work](https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/). Instead of describing in the abstract, now I can point you at concrete examples!

## Background: the project

[Camunda Platform 8][camunda-product] includes a handful of components that work together to facilitate process orchestration. Most of them are always on the same version — but some of them aren't! Our [Optimize][optimize] component, which empowers you to ?????, is on a completely different version number than the rest of the components.

Unfortunately, our docs weren't reflecting this. We treated the latest version of all components as version 8. And that was this project! Get the Optimize docs showing the correct version number.

As with anything, when you boil it down to a paragraph it sounds like way less work than the actual implementation. 😅

## The work before the work

As I mentioned in my previous article, small PRs start long before the PRs are opened. In this case, some up-front investigation helped identify ways to break the work down.

### Early exploration to identify and understand the work

I had two goals with the early exploration:

1. To understand what work was needed, so that I could break it down.
2. To resolve some uncertainty about how the tooling supported solving our problem.

So I built some proofs of concept. Initially to configure the versioning scheme correctly, then to ????, and along the way to make it possible to release incomplete changes. TODO fill this in

This investigation and prototyping resulted in a much better understanding of the work, and it enabled us to schedule it in three important ways: (TODO I don't think that's the correct end to that sentence. it's not ways.)

1. [Changes could be introduced incrementally][original#integrating-code-a-little-at-a-time].
2. [Infrastructural changes could be introduced separate from routine content movement][original#separate-infrastructural-work-from-implementations].
3. [Work could be sliced into smaller deliveries][original#start-with-small-scope-slice-your-stories-small].

I think this point is so important that I'm going to repeat it: the critical output of breaking down work is not only the smaller pieces. It's also the knowledge of which pieces are the scariest, riskiest, and most uncertain, so you can solve those first.

### Make the change easy before making the easy change

Of the 3 methods(?) above, I want to call out one in particular. Before writing a single line of code for the project, I wanted to make sure we could integrate incomplete changes a little bit at a time, especially at the beginning. As the project went on, and PRs started to resemble other previous PRs, it became less important to be able to integrate incrementally. But at the beginning, this was novel work -- we weren't sure what it would/should look like, and I wanted to feel safe introducing it in incomplete parts.

The first PR I opened for this project was to [introduce a "next" version of the docs][pr-next-version]. With an "under construction" version, I felt free to make as many changes there as I wanted. I could deploy incomplete changes and show them to people for feedback.

This is not the first time I've referenced this Kent Beck tweet, nor will it be the last. Building a seam before introducing changes is always easier than doing those two things simultaneously:

TODO: kent beck tweet

## Tracking the work

### One issue to rule them all

- main issue to track (and explain) work
  I'm actually not certain I used the best tool for this. Given the amount of times I went back and edited this tracking issue, and the amount of content it contains, it feels wrong. You can see the details of every item I completed along the way...but if you're interested in one item, it's a very dense description, and hard to filter noise from signal.

### explain PRs

- comments
- videos

---

## Separating infrastructure from routine work

- "next" version from above
- $docs$ aliases
  - I could have included this in a change with lots of content, but it would have gotten lost in the noise.

## Splitting stories

- one folder at a time initially

  - though sometimes there was too much tied together to separate
  - this was actually the case because I missed two of the folders :grimacing_sweat:

- one version at a time
  - this is also about scoping phases of work

## Descope mercilessly

- follow-up work
  - separating things into their own issues
