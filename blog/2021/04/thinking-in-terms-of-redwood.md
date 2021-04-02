---
title: Cross-Section Of A Redwood App
date: 2021-04-01T13:57:02.534
tags: post
layout: blog
snippet: I'm in love with RedwoodJS. I noticed that a recent PR on a personal project nicely captured a cross-section of a Redwood app — all the bits needed to pass data from the UI to the database and back.
tweet: I'm in love with RedwoodJS. I noticed that a recent PR on a personal project nicely captured a cross-section of a Redwood app — all the bits needed to pass data from the UI to the database and back.
draft: false
---

I'm in love with [RedwoodJS][redwoodjs]. It puts opinions around all the decisions you need to make to build a React app, and abstractions around the most common features you need to make the app usable. While I might not agree with _all_ of Redwood's opinions, I'm perfectly happy to accept them for the sake of shipping things. It allows me to focus on building features instead of worrying about infrastructure and setup.

I recently started building [a training journal app][pendulina] with Redwood. I've been embracing [pull requests as a means to tell stories](https://www.stevenhicks.me/blog/2021/03/prs-for-personal-projects/) on this personal project, and I noticed that some of my PRs show a nice cross-section of all the Redwood abstractions from the UI to the database.

In this article I'll give you a little background on the app I'm building and some fundamental Redwood concepts, and then we'll take a look at one of my recent PRs to see the cross-section of a Redwood app.

## Some background about my app

For the last few years I've tracked my running/triathlon training plans with a spreadsheet. It's worked fine, but are we even web developers if we're not turning spreadsheets into web apps?

I'm starting to ramp up my training for this year, and I decided I want [an app for tracking it][pendulina] this time. Nothing too complicated — I want to track my scheduled workouts, my actual workouts, and get a sense for whether I'm on-target with my training.

Here's what it looks like so far:

![My training journal app, showing two weeks worth of workouts](../pendulina-before.png)

## The change I want to introduce

My database model has an entity that represents each workout I want to get in. I call it a `PlanWorkout`. 

So far a `PlanWorkout` tracks things like activity (running, biking, etc.), target miles and/or duration, and intention for the workout (recovery, race, etc.). 

One thing that's missing — is the workout a _key_ workout? Is it the race I'm working up to? Is it maybe not a race, but a workout I'm really interested in crushing, like an [FTP test](https://www.triathlete.com/training/find-functional-threshold-power/)? I like to see these workouts on my grid, so I know when they're coming up.

The PR we'll look at adds a single field — `isKeyWorkout` — to the `PlanWorkout` model, and propagates it up the entire stack, from database to UI. 

## Some Redwood fundamentals

Here are some things to know about Redwood: 

1. A Redwood app consists of a React front-end and a GraphQL API back-end. You don't need to set any of this up...Redwood's CLI takes care of it for you.
2. The Redwood [Page](https://learn.redwoodjs.com/docs/tutorial/our-first-page) construct represents a page that a user can hit in your React app.
3. When you want to interact with your GraphQL back-end from your React front-end, you render a [Cell](https://learn.redwoodjs.com/docs/tutorial/cells) component. 
4. Within each Cell, you specify a few things: 
   * The queries/mutations it will send to the GraphQL endpoint.
   * The `Empty`, `Loading`, `Error`, and `Success` states of the component, based on data loaded from the GraphQL endpoint.
5. [The back-end](https://learn.redwoodjs.com/docs/tutorial/redwood-file-structure#the-api-directory) is supported by [a database schema definition file](https://github.com/pepopowitz/pendulina/blob/main/api/db/schema.prisma), [GraphQL schema definition files](https://github.com/pepopowitz/pendulina/blob/main/api/src/graphql/planWorkouts.sdl.js), and [services for handling data interaction and business logic](https://github.com/pepopowitz/pendulina/blob/main/api/src/services/planWorkouts/planWorkouts.js). Redwood ties these all together to give you a GraphQL endpoint with access to your database.

I've been thinking of these abstractions like a diagram of Earth's core, with the database at the center and the UI on the outside:

![Cross-section of a Redwood app, in the style of a 3d globe with a cutout to show the layers inside.](../cross-section.png)

## A PR that introduces the changes

I've done my best to tell a story in [the PR associated with this work](https://github.com/pepopowitz/pendulina/pull/28). To summarize what's happening: 

1. We [add a new field to the table representing a workout in the schema file](https://github.com/pepopowitz/pendulina/commit/5b524a05804f3e0c51f3b7ee103c072a7b1158df), and run [prisma](https://www.prisma.io/)'s migration tool to update the local database with the new field. (Prisma is the ORM that Redwood uses under the covers.)
2. We [expose the new field in all GraphQL endpoints that need it](https://github.com/pepopowitz/pendulina/pull/28/files#diff-09aba008345d26431717e3d7f5739bc7b66ff73456c93505ddd55a9fc06e489fR80) (queries _and_ mutations).
3. We [add the new field to all queries/mutations that need it](https://github.com/pepopowitz/pendulina/pull/28/files#diff-426f93dc3554728620e8e25c32bd5d4a4fbb7da8e702e0508718586e4fb00dc2R20), via the corresponding Cells.
4. We [add the new field in any UI components that will interact with it](https://github.com/pepopowitz/pendulina/pull/28/files#diff-61e6d2ce866a1c0722e323254f9fd7a792e86b6bde8597f53c05b72f254f2cf2R136). 

With these changes we can identify key workouts! Notice how the race at the end of week 2 is now (subtly) highlighted: 

![My training journal app, showing two weeks worth of workouts, with a race highlighted](../pendulina-after.png)

There's not a lot to this PR, but it demonstrates changes at most of the layers in our cross-section. 

A couple layers are missing. There are no changes to a `Page` or `service` — the PR is adding a new field to an _existing_ page, and no changes are needed there. If you're curious, [here is the `EditPlanWorkoutPage` that wraps the `EditPlanWorkoutCell` modified in the PR](https://github.com/pepopowitz/pendulina/blob/c52774d775e7a58b19a203684dff1e7f8bf86491/web/src/pages/EditPlanWorkoutPage/EditPlanWorkoutPage.js), and [here is the `planWorkouts` service that facilitates database interactions for the `PlanWorkoutForm` modified in the PR](https://github.com/pepopowitz/pendulina/blob/c52774d775e7a58b19a203684dff1e7f8bf86491/api/src/services/planWorkouts/planWorkouts.js).

In creating this PR, I used a similar one as a guide; when I need to add a field in the future, I'll use this PR as a guide.

## Consistent patterns mean less thinking

Consider apps you've worked with that don't have consistent patterns for common problems. You've probably spent a good amount of time digging through existing code to find a pattern that solves a problem, then more time deciding which of the multiple patterns you find is most representative of the preferred approach. 

With Redwood imposing opinions and structure, changes that travel the entire stack from UI to database are consistent and repeatable. No need to research the patterns and choose the correct one — there's only one pattern, and it's consistently applied throughout the app.

(And if you've worked with me in the past you just did a spit take, having watched me use semicolons on one line and no semicolons on the next, completely incapable of consistency in code.)



[redwoodjs]: https://redwoodjs.com/
[pendulina]: https://github.com/pepopowitz/pendulina