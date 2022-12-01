---
title: 'Breaking Problems Down: A Case Study'
date: 2022-11-30T16:42:18.795
tags: post
layout: blog
snippet: "I've written in the past about breaking problems down in the abstract. For the last couple months I've worked on a project where I can demonstrate it in real life!"
---

I've written in the past about [strategies for breaking Pull Requests (PRs) into smaller pieces][original]. In that article I give a number of recommendations for reducing the size of a PR....but it's still very abstract.

Recently I spent a couple months working on a large-ish project for the [Camunda Platform 8 documentation][c8-docs]. The size of the project forced me to practice what I preach. It involved moving _a lot_ of content, which could easily have turned into massive PRs, and left overwhelmed reviewers with no choice but to rubber stamp "LGTM" (looks good to me) on them. I also worked in relative isolation on this project, and since I was much deeper into the work than my reviewers, easily-digested PRs were an absolute requirement.

So consider this article almost an addendum to [my previous work][original]. Instead of describing in the abstract, now I can point you at concrete examples!

## Background: the project

[Camunda Platform 8][product-camunda] includes a handful of components that work together to facilitate process orchestration. Most of them are always on the same version — but some of them aren't! Our [Optimize][product-optimize] component, which you might guess empowers you to optimize a modeled process, is on a completely different version number than the rest of the components. Where most components are currently on version 8.1, the latest Optimize release is 3.9.0.

Unfortunately, our docs weren't reflecting this. We treated the latest version of _all_ components as version 8, even if that wasn't correct. And that was this project! Get [the Optimize docs][docs-optimize] showing the correct version number.

As with anything, when you boil it down to a paragraph it sounds like way less work than the actual implementation. 😅

## The work before the work

[Small PRs start long before the PRs are opened][original-start-small]. In this case, some up-front investigation helped identify ways to break the work down.

### Early exploration to identify and understand the work

I had two goals with the early exploration:

1. To understand what work was needed, so that I could break it down.
2. To resolve some uncertainty about how the tooling supported solving our problem.

So I built some proofs of concept:

1. [To explore the Docusaurus feature of "multi-instance versioning"](https://github.com/camunda/camunda-platform-docs/pull/904).
2. [To rougly apply "multi-instance versioning" to our Optimize documentation](https://github.com/camunda/camunda-platform-docs/pull/906).
3. [To make it possible to release incomplete changes](https://github.com/camunda/camunda-platform-docs/pull/910).

Along the way, I built a couple more proofs of concept when I ran into problems I wasn't sure how to solve:

4. [Reducing duplication across documentation instances](https://github.com/camunda/camunda-platform-docs/pull/921).
5. [Navigation issues across documentation instances](https://github.com/camunda/camunda-platform-docs/pull/1345).

This investigation and prototyping resulted in a much better understanding of the work. It even helped us identify work that, if done up front, would improve our ability to schedule and complete the remaining work in three important ways:

1. [Changes could be introduced incrementally][original-iterate].
2. [Infrastructural changes could be introduced separate from routine content movement][original-infrastructure].
3. [Work could be sliced into smaller deliveries][original-slice].

The critical output of breaking down work is not only the smaller pieces. It's also the knowledge of which pieces are the scariest, riskiest, and most uncertain, so you can solve those first.

### Make the change easy before making the easy change

Of the 3 improvements listed above, I want to call out one in particular. Before writing a single line of code for the project, I wanted to make sure we could integrate incomplete changes a little bit at a time, especially at the beginning. As the project went on, and PRs started to resemble other previous PRs, it became less important to be able to integrate incrementally. But at the beginning, this was novel work -- we weren't sure what it would/should look like, and I wanted to feel safe introducing it in incomplete parts.

The first PR I opened for this project was to [introduce a "next" version of the docs][pr-next-version]. With an "under construction" version, I felt free to make as many changes there as I wanted. I could deploy incomplete changes and show them to people for feedback.

This is not the first time I've referenced the following Kent Beck tweet, nor will it be the last:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">for each desired change, make the change easy (warning: this may be hard), then make the easy change</p>&mdash; Kent Beck 🌻 (@KentBeck) <a href="https://twitter.com/KentBeck/status/250733358307500032?ref_src=twsrc%5Etfw">September 25, 2012</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Building a seam before introducing changes is always easier than doing those two things simultaneously.

## Tracking the work

After the initial exploration and proposal, this project sat untouched for a month or two — for no important reason, there are just other things that I worked on. But the exploration gave us enough information to start tracking the work with some level of confidence.

There are a handful of different tools and artifacts we use to track projects at Camunda — Trello, Jira, GitHub, Google Docs... For the Developer Experience team in particular, we've moved to using GitHub to track almost everything. So for this project, I created [a single issue to list all the things we'd have to do to complete this project][epic-issue]. I initially filled it out from a high level, not too much detail, figuring I'd fill in more details as I learned them.

I have mixed feelings about this approach. I like that there is one place that tracks all of the work. I believe strongly in the importance of tracking the work publicly (or at least, visible to my team). This accomplishes that.

But by the end of the project the issue became pretty massive. If you're looking for something specific in that list of completed work, it's hard to find. Part of me thinks this might have been better served as a GitHub project, instead of an issue. I chose the artifact based on what I knew at the time, so I'm not holding it against myself for tracking it this way. I do think I'll be more conscious next time of how big an epic _might grow_ when I decide how to track it.

## Explaining the work

Knowing that I was working on this project mostly in isolation, it was critical to explain my work to reviewers who had less context. I learned some good habits about [adding context to PRs][artsy-adding-context-to-prs] while at Artsy. On this project I got to put them to good use — especially [adding videos to demonstrate changes][pr-video] ([direct link to video][video]), and [inline comments identifying the interesting changes][pr-comments].

A couple other good reasons to explain work at this level:

1. When anyone comes back to this in the future, there will be plenty of context. They shouldn't have to spend much time spelunking Slack or asking "hey I know this is a long shot, but do you remember why we wrote this line of code 6 months ago?"
2. It makes for a nice reference point whenever we want to do something similar in the future, or when someone on the internet asks a question about how to do this thing.

## Separating infrastructure from routine work

Pull requests that combine significant infrastructural changes with routine changes [are a recipe for losing the signal amidst the noise][original-risky].

One example of this was mentioned above — [introducing a "next" version of the docs][pr-next-version], which was shipped separately from any content changes. After it was merged, I was free to twiddle with content all I wanted, but I wouldn't have wanted someone to have to review both types of changes in one place.

Another example — [while I was moving Optimize documentation into its own section for the first time][pr-first-version], I noticed that the multiple sets of versions were going to create a cross-linking mess. We'd end up with hard-coded versions in URLs when linking across the documentation, and have to update them whenever new versions were released. Before completing [the first Optimize docs PR][pr-first-version], I introduced [an infrastructural enhancement for cross-linking][pr-cross-linking].

Sequence in this case probably didn't matter too much; the importance to me was that I had two related but distinct changes, and I wanted to keep the history of them separate. Aside from making it easier to review, this approach prevents [one ready feature from being held up by one disputed feature][original-what-is-small].

## Splitting stories

Even though there was a ton of content to move in this project, there presented two natural ways to split the content into smaller pieces: by version, and by content section.

Splitting by version was something we noticed up front. We could iterate through the different versions, starting with the most recent version and ending with the oldest, and migrate content one version at a time. This also presented itself midway through the project as an opportunity to defer work. As we worked through newer versions, we realized that the oldest versions were less important to us, and we de-prioritized them.

Splitting by content section was not noticed up front. In fact I only discovered this natural seam on accident — by forgetting to do two of three content sections! 😅😬 When a stakeholder pointed out that I'd only shipped one section of the first version, I decided this was fine, and actually a good way to break things down for the other versions.

## De-scoping mercilessly

One of my constant struggles in software development is deciding when a bug or edge case should be resolved with the work I'm doing, or if it can be done later. I have a high standard for "done" — sometimes too high. Perfect is the enemy of good, as....someone says. And I fall for perfection just about every time.

I've gotten better at de-scoping and deferring these kinds of things, and this project was an opportunity for me to demonstrate my progress. Many issues came up as I was working, and you can see [in the epic for this project][epic-issue] that we treated many of them as follow-up work instead of blocking issues.

---

Do you have any real life examples of breaking problems down into smaller pieces? [Let me know!](/where)

[original]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/
[original-start-small]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/#small-prs-start-long-before-the-work-starts
[original-iterate]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/#integrating-code-a-little-at-a-time
[original-infrastructure]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/#separate-infrastructural-work-from-implementations
[original-slice]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/#start-with-small-scope--slice-your-stories-small
[original-risky]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/#separate-riskycontroversial-work-from-routine-work
[original-what-is-small]: https://artsy.github.io/blog/2021/03/09/strategies-for-small-focused-pull-requests/#what-is-small-and-focused
[c8-docs]: https://github.com/camunda/camunda-platform-docs
[product-camunda]: https://camunda.com/platform/
[product-optimize]: https://camunda.com/platform/optimize/
[docs-optimize]: https://docs.camunda.io/optimize/components/what-is-optimize/
[epic-issue]: https://github.com/camunda/camunda-platform-docs/issues/1116
[pr-next-version]: https://github.com/camunda/camunda-platform-docs/pull/1118
[pr-optimize-infra]: https://github.com/camunda/camunda-platform-docs/pull/1166
[artsy-adding-context-to-prs]: https://artsy.github.io/blog/2020/08/11/improve-pull-requests-by-including-valuable-context/
[pr-video]: https://github.com/camunda/camunda-platform-docs/pull/1170
[video]: https://www.loom.com/share/511730f7dbec41e9ad6fb1d748da0041
[pr-comments]: https://github.com/camunda/camunda-platform-docs/pull/1328
[pr-cross-linking]: https://github.com/camunda/camunda-platform-docs/pull/1170
[pr-first-version]: https://github.com/camunda/camunda-platform-docs/pull/1166
