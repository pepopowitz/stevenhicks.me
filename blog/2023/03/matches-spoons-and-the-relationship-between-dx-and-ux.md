---
title: Burning Matches And The Relationship Between Developer Experience and User Experience
date: 2023-03-16T12:00:51.528
tags: post
layout: blog
snippet:
---

Developer Experience (DX) is kind of having a moment right now — and not necessarily a good one. In recent months there's been a lot of discourse pushing back on the importance of DX — or at least its importance relative to the importance of User Experience (UX). My favorite article to capture the moment is [Redefining Developer Experience][better-dx-article], by [Cole Peters][better-author]. Start there, if you aren't sure what I'm referring to.

I recently listened to a podcast episode that talked about the relationship between Developer Experience and User Experience. I don't recall what the episode said about this relationship....I _do_ recall that I wasn't satisfied with it.

It's very possible that a part of me wants to write this article to make myself feel better about my life choices. I'm less than a year into my first job with the words "developer experience" in the title. Still, even if it's confirmation bias, I truly think I believe these things.

Since its conception, the field of Developer Experience has not defined itself clearly. As [Cole suggests][better-dx-article], this lack of a consistent interpretation or definition is certainly a significant factor in the disagreement on the importance of DX.

Not long ago I was at a conference, where I met two other people with the exact title as me — "Developer Experience Engineer." All three of us did completely different things. When I meet people and tell them my title, they often ask "what does that mean"; sometimes I introduce myself as "a Developer Experience Engineer...but I'm not sure what that means!" Beyond this specific title, there seems to be an identity crisis for the entire term "developer experience".

I'm not sure how you think about DX. I've got two metaphors, and one questionable psychological theory, to explain how _I_ think about DX, why I think it is important, and how I see its relation to UX.

## Burning matches

If you watch a cycling race, you're likely to hear the broadcasters talk about burning matches. The metaphor is this: at the beginning of a race, each rider starts with a book of matches. Each hard effort a rider gives burns one match from the book. Riders can choose when to burn each match...but once the matches are all burned, they have no hard efforts remaining.

You may have noticed this in any sport. When you're fresh, you can put in a hard effort. It feels great! But put in a bunch of hard efforts over time, and your body just can't give you anything more.

In a cycling race, it's a balancing act of burning the matches at the best time. If you can save a match for the sprint at the end of a race, you've got a chance of winning it. Burn them all too early, and you don't.

## Spoon theory

[Spoon theory](https://en.wikipedia.org/wiki/Spoon_theory) is a metaphor originally used in the context of chronic illness, and which has since been used to describe many other scenarios.

Imagine a person starts their day with a limited number of spoons. Each activity throughout the day exhausts energy, and uses one spoon — even ordinary tasks. By the end of the day, their spoons are all gone, and the person has no remaining energy for even a small task.

Resting replenishes their spoons, so they can start over again the next day. But spoons need to be managed carefully every day, or the person runs the risk of exhausting their supply long before bedtime.

## Ego depletion

Both these metaphors "rhyme" with the concept of [ego depletion](https://en.wikipedia.org/wiki/ego_depletion).

Ego depletion refers to the idea that our willpower is based on our mental energy, which is of limited supply. The more mental energy we have, the more likely we are to show self-control, and make choices that are better for us in the long term. As we use our mental energy throughout the day, our willpower is weakened, and we're more likely to make short-sighted choices for immediate satisfaction. Think food choices — you might find it manageable to avoid unhealthy foods early in the day...but after a long frustrating day of work, cookies are hard to resist. Maybe that's just me.

The concept of ego depletion is controversial. The validity of studies that demonstrate ego depletion are questioned. This is one of the many ideas that frustratingly falls into the bucket of "seems logical....no proof in either direction....and it might just be in your head."

But hey, I believe in it! Therefore it is real. For me, at least.

## What does this have to do with building software?

Ego depletion, or something like it, appears in software development too. When a developer's tooling is working for them, they're able to put more effort toward the details that make a difference for the user. When the tooling fights them, their energy is exhausted, and they're less likely to put effort toward user-facing details.

If I burn two matches trying to test an asynchronous event handler on a React component, those matches are gone! If I spend three spoons fighting a weird webpack error, I'm becoming exhausted. Neither of these issues directly impact the user, but I've burned my energy on them. When something comes up late in the day that _actually_ impacts the user — maybe something missing in regards to accessibility, maybe an important edge case in some component that only affects a small amount of users — my energy to deal with it appropriately depends on how much I've fought my tooling all day.

This is why I think Developer Experience matters. DX that works with you leads to better UX. Energy I must put into _how_ I'm building a product pulls directly from energy I would have put into _what_ I'm building.

I don't care as much about how shiny and hot the tools are that I'm using. I care that the tools I'm using are guiding me to a [pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/), where I don't need to invest a ton of effort to build a proper experience for the user.

There's certainly a risk of over-optimizing for DX at the expense of UX, in anything we build. Developers can easily overlook that imbalance because they aren't the actual product user. But even when prioritizing the user's experience, the developer's experience matters. If creating a good UX requires a lot of effort from developers, they just aren't going to do it.

The answer, as always, lies somewhere in the middle.

[better-dx-article]: https://begin.com/blog/posts/2023-02-28-redefining-developer-experience
[better-author]: https://mastodon.online/@colepeters
