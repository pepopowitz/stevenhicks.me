---
title: Automating social posts with GitHub actions and Zapier
date: 2021-05-06T13:50:41.238
tags: post
layout: blog
snippet: Automation is weird. Sometimes we automate the smallest things, and even though it might not save us that much time, it's totally worth it. Like when I didn't want to spend five minutes tweeting my new articles anymore!
tagline: Automation is weird. Sometimes we automate the smallest things, and even though it might not save us that much time, it's totally worth it. Like when I didn't want to spend five minutes tweeting my new articles anymore!
tweet: "Automation is weird. Sometimes we automate the smallest things, and even though it might not save us that much time, it's totally worth it. 

Like when I didn't want to spend five minutes tweeting new articles anymore!"

---

Automation is weird. There must be a cognitive bias that explains the urge to [automate](https://xkcd.com/974/) [things](https://xkcd.com/1205/) as a [developer](https://xkcd.com/1319/). I think it's a combination of two things:

1. There's an inflection point where the payoff of automation doesn't matter anymore, because the perceived investment is so low. (This is almost certainly an inaccurate assessment.)
2. Sunk cost fallacy quickly sets in and you continue to think the automation is _just around the corner_, and you can't possibly give up now.

A real-life example:

I spend a maximum of five minutes putting together social media posts when I write a new article on my blog. Five minutes! But I will be goddamned if I'm going to do that manually. **Am I a cave person?!?!?!?!** I am not. There are certainly existing services I can piece together to do this for me, right? With like, zero effort?

It turns out I'm kind of right!

## Why would I even do this?

I dream of a day where writing blog posts is a thing I do during the day. For now, it's a thing I do late at night. Mornings are for workouts, days are for working, early evenings are for kids' activities, mid-evenings are for dinner and TV with my partner....and finally late-evenings are for vomiting my brain-thoughts here. Most of the nights I write articles, I get sucked into a groove and finally finish them around 11pm or 12am.

Not very many people read articles at 12am. You might if you're having trouble sleeping. But I don't want to share my new articles at 12am — I want to share them early the next morning, so that more people see them.

You're right — I could totally schedule the sharing of my articles the next day with something like TweetDeck or Buffer. Or I could just wait until the right time and post things manually. But like I said above, **I am not a cave person**. I'm a developer, and I can build this solution myself!

## What does this look like?

My dad is a retired plumber. One of the things I'm most impressed with is his ability to look at a three-dimensional space, identify something valuable at a source, identify the location that resource is needed, and propose a physical combination of materials to get from source to target. It's honestly magical — he sees stuff in the ceiling of the basement that I don't see, routes that I would never know existed, combinations and solutions I'd never consider.

I [replaced a kitchen faucet this winter](https://www.stevenhicks.me/blog/2021/01/tips-for-working-with-legacy-code/), but I can't do squat with copper pipes! I think I inherited his system-level vision, though — only applied to software development.

From my dad's plumber eye, here's what our end solution looks like:

### A. I create a pull request for my new article, with a scheduled merge date.

### B. A GitHub action merges the article at that scheduled date.

### C. Once merged, the article is added to a tweets.xml RSS feed.

### D. The [Zapier workflow automation platform](https://zapier.com/) watches the tweets.xml RSS feed for new posts. When it sees one, it posts the content from that feed to Twitter/LinkedIn/MySpace/etc.

## Step 1: Output a new RSS feed: tweets.xml

This is a pretty straight-forward step for me, given I'm using [eleventy](https://www.11ty.dev/) to staticaly generate my blog, and I already have it generating a [feed.xml](https://github.com/pepopowitz/stevenhicks.me/blob/main/_feed/feed.xml.njk) so that you can subscribe to my new posts.

I create [a new template for a feed named `tweet.xml`](https://github.com/pepopowitz/stevenhicks.me/blob/main/_feed/tweets.xml.njk), and I [iterate all tweetable articles on my blog](https://github.com/pepopowitz/stevenhicks.me/blob/main/_feed/tweets.xml.njk#L29). I define "tweetable articles" in my `eleventy.js` as [articles that contain a `tweet` property](https://github.com/pepopowitz/stevenhicks.me/blob/main/.eleventy.js#L28-L34). This means the only articles that will show up in this feed are the ones [I specify a `tweet` property for](https://github.com/pepopowitz/stevenhicks.me/blob/main/blog/2021/03/prs-for-personal-projects.md).

I [hydrate the contents of each item with the value of the `tweet` property](https://github.com/pepopowitz/stevenhicks.me/blob/main/_feed/tweets.xml.njk#L36).

When this template gets processed by eleventy, it generates [an RSS feed that contains the exact contents I want to share to social media](https://www.stevenhicks.me/tweets.xml).

One thing that's important here is to make sure the feed you're generating [is valid](https://validator.w3.org/feed/). Every time I've had an article not publish when I think it should publish, it's because the feed I've generated is no longer valid. Computers only do what you tell them to do!

## Step 2: A GitHub action to merge new posts on a schedule

If I were to commit an article with a `tweet` property to `main` directly, I'd get a new article in my `tweets.xml` feed right away. Because I'm typically writing late at night, I don't want that! I want to wait to add my article to `tweets.xml` until a time of day when people aren't sleeping.

I've written previously about [the benefits of creating PRs for personal projects](https://www.stevenhicks.me/blog/2021/03/prs-for-personal-projects/), but here's another benefit of that practice — I can use [a GitHub action to merge a PR at a scheduled time](https://github.com/gr2m/merge-schedule-action), and delay publishing a new article until a better time of day.

With [this action configured on my website](https://github.com/pepopowitz/stevenhicks.me/blob/main/.github/workflows/merge-schedule.yml), I can add [a timestamp to a PR for my new article](https://github.com/pepopowitz/stevenhicks.me/pull/30#issue-601297076) using a specific format, and [the next time my action runs](https://github.com/pepopowitz/stevenhicks.me/runs/2199184916?check_suite_focus=true), it will merge the scheduled PR.

I've got my action scheduled to check for mergeable PRs at 15:15 UTC every day. That's 9:15 or 10:15 every morning for me. This is a time I've decided it's worth sharing my posts.

## Step 3: A Zapier zap to publish from an RSS feed to a social platform

At this point I've got the ability to merge new articles at a scheduled time, and an RSS feed containing bodies of social media posts that's only updated on that schedule.

The final step – watch the `tweets.xml` RSS feed for new items, and push them to Twitter/LinkedIn/etc.

[Zapier](https://zapier.com) is an automation workflow platform. We can tell it to watch for a specific event (additional items in an RSS feed), and perform a specific action (publish the contents of that RSS item to social media platforms).

In this case, we'll set up a zap that listens to a "New item in Feed" and with its contents, "Creates Tweet in Twitter". There are lots of settings in the Zapier UI here but I'll highlight the most pertinent: generating the tweet itself.

![Zapier connecting RSS to Twitter](../zapier-to-twitter.png)

The most important thing worth noting here is that you're going to set up the action to consume specific fields from the RSS feed: `Raw Content` and `Link`. When this zap runs, it's going to effectively capture the `tweet` property from my new post and share that content to Twitter, because that's what's in `Raw Content`.

Zaps run every 15 minutes or so, so there's a very slight delay between when an article is merged to `main` and when it gets shared to social platforms. Eventual consistency, amiright?

But cool — Every time I schedule an article to be merged, as long as I include a `tweet` property, _the robots post it to social media for me_. This is the dream! Less nonsense like opening Twitter and LinkedIn on my own. More robots just doing it all for me. **Robots!!!!** 🤖🤖🤖 ❤️❤️❤️ 💪🏼💪🏼💪🏼

Now I can get back to more human tasks, like drinking micro-brews and watching professional cycling races. Thanks, robots!
