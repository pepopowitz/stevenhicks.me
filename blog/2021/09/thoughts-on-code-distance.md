---
title: Thoughts On Code Distance
date: 2021-09-17T09:27:10.311
tags: post
layout: blog
snippet: I've been thinking this week about code distance — the distance between bits of code that are related to the same feature. I wonder if there's a good metric for this?
---

I've been thinking this week about code distance — the distance between bits of code that are related to the same feature. Traversing a few lines in a single small function is a small distance; traversing a hundred or so lines from one end of a file to another is a medium distance; traversing entire folder structures is a large distance.

Sometimes code distance bothers me, sometimes it doesn't.

An example where it doesn't bother me: the distance between tests & their setup code. This came up recently in our Artsy Slack re: [`let` in RSpec tests][let-context-article]. Sometimes the variable you're looking at in a test was set up 100 lines away from the line you're reading. You have to either navigate this distance to fully understand the code, or make an assumption about the setup. Test setup is one area where I feel comfortable making assumptions; I'm not sure why, honestly. When I write tests, I put everything unique to the test in or near it. I guess that's made me feel comfortable assuming that anything that isn't in or near a test can be assumed to contain a reasonable default.

Code distance of features, on the other hand, bothers me tremendously. When I need to update multiple files in distant parts of a codebase in order to add a new feature, this feels like a huge opportunity to miss something. This happens in our Artsy CMS artwork form when I want to add a new field to the form — there are _a lot_ of different files I need to touch, in a lot of different places. We miss at least one of these places just about every time we add a new feature.

I wonder if there's a way to represent the "code distance" in a PR? A PR with a high "code distance" value could represent:

- An unfocused PR that has potential to be broken into multiple smaller PRs
- A cross-cutting PR that makes infrastructural changes (and is therefore expected to have a large code distance)
- An indication that something in the architecture of your code could change to reduce the distance. Are large code-distance PRs happening frequently? That probably means your code doesn't align with the features you're building.

And then based on a history of PRs, I wonder if you can see trends of code distance? Are there [radar charts][radar-chart] or some better visualization to show the distance of changes in a PR? If I see PRs with similar distances or visualizations, is that a clue to re-architect a bit and shorten that distance?

🤷 If you've got answers or thoughts about this, [let me know](https://twitter.com/pepopowitz/status/1438879983691239425)!

[let-context-article]: https://www.stevenhicks.me/blog/2021/09/what-javascript-tests-could-learn-from-rspec/
[radar-chart]: https://en.wikipedia.org/wiki/Radar_chart
