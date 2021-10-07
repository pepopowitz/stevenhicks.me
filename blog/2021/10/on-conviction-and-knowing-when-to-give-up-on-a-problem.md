---
title: 'On Conviction: Knowing When To Give Up On A Problem'
date: 2021-10-07T14:12:37.490
tags: post
layout: blog
snippet: Recently I had an experience where a conviction and my determination helped me dig deep to solve a problem. When reflecting on it, I started to wonder when conviction is helpful as a developer, and when it is harmful.
---

Recently I had an experience where a conviction and my determination helped me dig deep to solve a problem. When reflecting on it, I started to wonder when conviction is helpful as a developer, and when it is harmful. One can get stuck down a rabbit hole when they can't let go of something; but deep problems often benefit from a strong belief that they can be solved.

The recent experience: [Anna](https://twitter.com/anna_carey) and I were looking at tests that didn't work. We have a form with some radio buttons, and when the buttons are clicked there are some side-effects on the page. We wanted to test this interaction — find the radio button, click it, and make sure certain things were/weren't showing on the page. We couldn't get the test to pass because the side-effects never showed up. We gave up and moved to a testing model we were less happy with — calling the "onSelect" handler of the radio button directly, instead of simulating how the user would make that thing happen.

Later that day I couldn't let it go. I needed to know why we couldn't simulate click on that radio option. I eventually _did_ figure out why. There were many tools & tricks I used along the way -- console.logging, console.logging from within the node_modules folder, code removal for isolation, github's UI to show me the previous version of the code, .... but when it came down to it, I wouldn't have used any of those tools without **conviction**.

I _knew_ that we should have been able to simulate click and test for the side-effect. It was something I've done before (or at least I was convinced it was something I've done before.). Even though I was fighting challenges left and right, conviction kept me digging.

But at some point conviction becomes a detriment. You end up deep down a rabbit hole with no clear escape. In this example _I was right_, but in many other examples _I am wrong_. In this example I found the answer, but in many other examples I've given up and moved on.

How does one know when to cut bait? How do you decide when your conviction is misguided or not worth fighting for?

We talked about this in [today's episode of Artsy Engineering Radio][podcast]. [Jon](https://twitter.com/jonallured) suggested the "15 minute rule" (or whatever number of minutes you decide). After 15 minutes of not making progress, it's time to give up. But this is always squishy for me. Sometimes you make progress within 15 minutes but it's not really progress — you take a few steps down a path but it still ends up leading you far away from the exit. These are the times when you end up down that rabbit hole, far from escape. Other times it takes you a little longer than your limit to make progress, but how would you know that if you hadn't violated the 15 minute rule?

I wasn't able to answer the question when we recorded, but having thought about it more I think I see it as [arrows in a quiver](https://ashfurrow.com/blog/specializing-in-being-a-generalist/). Each tool & trick I used to figure out why this wasn't working was a different arrow I could try, to help me isolate the problem. If an arrow isn't fruitful or it proves to be a lot of effort, I move on to the next arrow. When an arrow is fruitful, it points me at something new in the code, and I get a new bag of tricks to try _there_. If at any point I run out of arrows, that's when it's time for me to reassess. Is my conviction misguided? Am I thinking about this wrong? And is it worth moving forward, or is it time to cut bait? Is there someone I can talk to to bounce ideas off of, to get a check on whether my mental model is making sense?

This is why I find pairing to be so valuable. It's less about the specific code you're writing as a pair, and more about acquiring new arrows for your quiver. Watching someone else solve a problem teaches you new tools and tricks. It took me a long time as a JavaScript developer to learn that I could edit things in `/node_modules` directly. I don't remember the moment that I learned that strategy, but I definitely didn't learn it on my own. I learned it by watching another developer while pairing.

### Because you're dying to know

Why couldn't we simulate a click on that radio option and verify that a side-effect occurred? [Because the handler for clicking on the radio button was debounced](https://github.com/artsy/palette/blob/a006273ad60b7c8af36ed037ee03cc273e5e21f1/packages/palette/src/elements/Radio/Radio.tsx#L62). [Debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/) is a way to prevent an event from firing multiple times in a row (think rapid-fire clicking). This call was debounced for a reason — but it was also preventing our handler from being called unless we used [Jest's fake timers](https://jestjs.io/docs/timer-mocks) to advance time. As I said in [the podcast][podcast] — the one part of my life I feel like I'll never have a full grasp of is testing asynchronous events in JavaScript 😅

[podcast]: https://artsyengineeringradio.buzzsprout.com/1781859/9328525-37-request-for-comment-7
