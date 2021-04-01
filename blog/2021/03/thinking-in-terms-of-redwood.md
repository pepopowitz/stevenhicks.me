---
title: Thinking In Terms Of Redwood
date: 2021-03-31T23:57:02.534
tags: post
layout: blog
snippet: I'm in love with RedwoodJS. How do I think in terms of Redwood to build a feature? I've got a PR that demonstrates it. 
draft: false
---

I'm in love with [RedwoodJS][redwoodjs]. It puts opinions around all the decisions you need to make to build a React app, and abstractions around the most common features you need to make the app usable. 

I want to share a small change I made to [an app I'm building with RedwoodJS][pendulina] recently, as a demonstration of how to think in terms of Redwood.

## Some background about my app

For the last few years I've tracked my running/triathlon training plans with a spreadsheet. It's worked fine, but are we even web developers if we're not turning spreadsheets into web apps?

I'm starting to ramp up my training for this year. I recently started building [an online training journal][pendulina]. Nothing too complicated — I want to track my scheduled workouts, my actual workouts, and get a sense for whether I'm on-target with my training.

Here's what it looks like so far:

![My training journal app, showing two weeks worth of workouts](../pendulina-before.png)

## The change I want to introduce

My database model has an entity that represents each workout I want to get in. It's probably a bad name, but I call it a `PlanWorkout`. 

So far it tracks things like activity (running, biking, ...), target miles and/or duration, and intention for the workout (recovery, race, etc.). 

One thing that's missing — is the workout a _key_ workout? Is it the race I'm working up to? Is it maybe not a race, but a workout I'm really interested in crushing, like an [FTP test](https://www.triathlete.com/training/find-functional-threshold-power/)? I like to see these workouts on my grid, so I know when they're coming up.

## Some basics about Redwood

Before I share the PR that introduces these changes, here are a few important concepts to know about Redwood: 

1. A Redwood app consists of a React front-end and a GraphQL API back-end. You don't need to set any of this up...Redwood's CLI takes care of it for you.
2. The Redwood [Page](https://learn.redwoodjs.com/docs/tutorial/our-first-page) construct represents a page that a user can hit in your React app.
3. When you want to interact with your GraphQL back-end from your React front-end, you render a [Cell](https://learn.redwoodjs.com/docs/tutorial/cells). 
4. Within each Cell, you specify a few things: 
   * The queries/mutations it will send to the GraphQL endpoint
   * The `Empty`, `Loading`, `Error`, and `Success` states of the component, based on data loaded from the GraphQL endpoint
5. [The back-end](https://learn.redwoodjs.com/docs/tutorial/redwood-file-structure#the-api-directory) is supported by [a database schema definition file](https://github.com/pepopowitz/pendulina/blob/main/api/db/schema.prisma), [GraphQL schema definition files](https://github.com/pepopowitz/pendulina/blob/main/api/src/graphql/planWorkouts.sdl.js), and [services for handling data interaction and business logic](https://github.com/pepopowitz/pendulina/blob/main/api/src/services/planWorkouts/planWorkouts.js). 
6. Redwood's CLI can [scaffold out](https://redwoodjs.com/docs/cli-commands.html#scaffold) an "admin" interface for you, for managing data. You could build all of this yourself, by creating the individual pages, cells, services, schema files, etc. but the CLI saves you a lot of time by generating repetitive admin screens and the back-end to support them. 

## The PR that introduces the changes

[Pull requests tell stories](https://www.stevenhicks.me/blog/2021/03/prs-for-personal-projects/), and I've done my best to tell a story in [the PR associated with this work](https://github.com/pepopowitz/pendulina/pull/28). To summarize what's happening: 

1. We [add a new field to the table representing a workout in the schema file](https://github.com/pepopowitz/pendulina/commit/5b524a05804f3e0c51f3b7ee103c072a7b1158df), and run [prisma](https://www.prisma.io/)'s migration tool to update the local database with the new field. (Prisma is the ORM that Redwood uses under the covers.)
2. We [expose the new field in all GraphQL endpoints that need it](https://github.com/pepopowitz/pendulina/pull/28/files#diff-09aba008345d26431717e3d7f5739bc7b66ff73456c93505ddd55a9fc06e489fR80) (queries _and_ mutations).
3. We [add the new field to all queries/mutations that need it](https://github.com/pepopowitz/pendulina/pull/28/files#diff-426f93dc3554728620e8e25c32bd5d4a4fbb7da8e702e0508718586e4fb00dc2R20), via the corresponding Cells.
4. We [add the new field in any UI components that will interact with it](https://github.com/pepopowitz/pendulina/pull/28/files#diff-61e6d2ce866a1c0722e323254f9fd7a792e86b6bde8597f53c05b72f254f2cf2R136). 

With these changes we can identify key workouts! Notice how the race at the end of week 2 is now (subtly) highlighted: 

![My training journal app, showing two weeks worth of workouts, with a race highlighted](../pendulina-after.png)

## How do you "think in terms of Redwood"? 

I'm admittedly in the early stages of my exploration with Redwood. Here are some things I've learned so far: 

1. On the React side, the most important abstraction is the Cell. When you need to interact with the server, you need a Cell. You can propagate any data from there to a component that needs it. 
2. On the server-side, everything has been pretty much paperwork for me so far. It's been mostly a matter of specifying the correct fields and types in the schemas and services.
3. Redwood has opinions, and while I might not agree with _all_ of them, I'm perfectly happy to accept their opinions for the sake of shipping things. I can focus on building features instead of worrying about infrastructure and setup.


[redwoodjs]: https://redwoodjs.com/
[pendulina]: https://github.com/pepopowitz/pendulina