---
title: Automating Pull Requests With Sed And The GitHub CLI
date: 2022-11-15T16:33:02.834
tags: post
layout: blog
snippet: Recently I needed to make a bunch of nearly duplicate pull requests. Like any good programmer, I automated the repetition, using sed and the GitHub CLI.
---

<div style="width: 50%; margin-left: auto;margin-right: auto;">

![xkcd comic on automation](https://imgs.xkcd.com/comics/automation.png)

_[Obligatory xkcd comic on automation](https://xkcd.com/1319/)_

</div>

## TL;DR

[Here's a Bash script to][script]:

1. Take a branch name
2. Create a new branch based on the original
3. Call some scripts to update files
4. Use sed to update a config setting in another file
5. Commit the changes
6. Push up a GitHub PR with a lot of information filled in

On the other hand, if you've got some time...

## Pull up a chair and listen to me talk about my personality again 🙄

My learning style looks something like this:

1. Run into a problem
2. Discover or remember a tool that could solve that problem
3. Learn that tool just enough to solve the problem
4. Never go back to that tool until the next problem wants it

It's kind of frustrating, actually — I would love to be the kind of person who dives **deep** into something new. I'd love to stay interested in a topic for more than one problem. Instead, I learn a little about a tool, and lose interest in it until I need it again. This is why this blog seems so scatterbrained, I think — no content strategy here, friends! Just a bunch of mismatched tangentially related solutions to very specific problems.

Nowhere is this more obvious than in my use of shell scripting. I know enough Bash to be ...very very casually dangerous. Like tortoise-shell-sunglasses-and-fake-leather-bomber-jacket dangerous.

Recently I got a chance to grow my shell scripting skills! When I recognized the need for [sed][sed], I was excited that I finally knew enough about it to recognize a case for it.

And as soon as I'd automated that, I recognized another opportunity — to get a little more knowledge of [the GitHub CLI][gh-cli].

## The use case, in detail

We have [some older docs at Camunda][docs] that are built with Hugo. There are about 20 versions that we maintain, and [each version is built from its own branch][docs-versions]. This is a pain when you have to update more than one version. Thankfully, that doesn't happen very often.

But ooohhhhh, when it does! When it does!

We recently learned that we had sabotaged our docs by de-indexing most of them from Google search results. Yikes! Very long story short — when providing multiple versions of documentation, make sure you explicitly declare one version as the canonical. If you don't, Google _will pick one for you_! And _it might pick one that you told it not to index_!!

To resolve this, I wanted to apply canonical URLs to all versions of our docs. Which meant I had to make nearly identical changes to all ~20 versions/branches. The changes themselves were relatively simple:

- Update the theme to include canonical URLs
- Configure a site-level setting to use the correct base URL

## Feel the pain before addressing it

More personality stuff, sorry. Here's one rule of developer experience that I feel pretty strongly about:

> Before you address a problem, you should feel the pain of it as directly as possible.

Otherwise you're just guessing at the solution.

As a bonus, having a way to experience the problem gives you a nice feedback loop. You'll know you've fixed the problem when you no longer experience it.

All this to say, I had a hunch I might want to automate these PRs, but I didn't feel comfortable automating them until I knew what the repetition looked like. So I worked through the first few manually.

Once I'd been through the process a few times, I recognized the repetition. For each version of the docs, I needed to:

1. Manage my branch
2. Run a command to update a few files
3. Update a configuration file by changing one setting
4. Commit it all
5. Create a PR based on a template

1, 2, and 4 were already in my toolbox. 3 and 5 were not.

## 3. Updating a configuration file with sed

[sed is a "stream editor"][sed]; for my needs, that effectively means it's a command line tool for editing the contents of a file. It's not just the editing that makes it the right tool to change a config setting — it also makes it easy to target text, by filtering the stream/file.

My specific use case was to modify the value of the `baseURL` configuration setting, to include a domain. So where the config file previously read:

`baseURL: "/some/value"`

I needed it to read:

`baseURL: "https://docs.camunda.org/some/value"`.

I'd previously heard of sed, and previously used sed, but mostly in the context of copy-pasting things from the internet. This was the first time I'd looked at a problem and thought "oh, I could use sed to do that!"

And I'll be honest -- my understanding is still not far beyond [cargo-culting][cargo-culting]. What I _can_ say is that these are the arguments I needed:

- `-i ''` to edit the file inline, rather than create a copy
- `-E` to use "extended" regular expressions, because my regular expression used [a capture group][capture-group]
- `'s/...matching pattern.../...replacement pattern...'/g` to substitute text for a regular expression match
- the file name to edit

In the end, this is what my command looked like:

```sh
sed -i '' -E 's/baseURL: \"(.*)\"/baseURL: \"https:\/\/docs.camunda.org\1\"/g' config.yaml
```

This searches the `config.yaml` file for the `baseURL` setting, and injects the domain before its current value.

The most frustrating part about writing this command was figuring out that I needed the `-E` flag in order to use a capture group in my regular expression.

Yay, computers!

## 5. Creating a PR with the GitHub CLI

I'd previously opened many GitHub PRs, and I even use the GitHub CLI to do it every single time (although I abstract it behind [an alias I call `open-pr`][open-pr]).

And initially, that's what I scripted. But I found myself going into the GitHub UI to update things repetitively. I figured there had to be some arguments I could use to change those values for me.

[There are][gh-arguments]!

In particular, I was interested in these arguments:

- `--web`: to open the web interface, so that I could make some final changes before creating the PR
- `-t`: the title of the PR
- `-a`: PR assignee, which I could set to myself with the identifier `@me`
- `-B`: the base of the PR, meaning which branch it should be merged into
- `-b`: the body of the PR.

I also assigned a bunch of variables ahead of time, to make my command easier to read:

```sh
gh pr create --web -t "$TITLE" -a @me -B $VERSION -b "$BODY"
```

## Stitching it all together

You can see my final script [in this gist][script]. I've done my best to comment it well, but feel free to leave comments in there if anything doesn't make sense or could be improved.

## Extra credit: automating the screenshots

When using the GitHub CLI to open a PR, I chose to use the web interface because there was still one repetitive task I didn't want to automate: adding screenshots to the body of the PR.

I'm certain there are tools to do this, but it seemed like a can of worms I didn't want to open. Getting everything but the screenshots was 95% of the win. I didn't mind having to take two screenshots and then paste them into the GitHub UI.

If you've automated this step as part of opening a PR, [I'd love to hear about it](/where)!

[script]: https://gist.github.com/pepopowitz/125e1102d455d5cdb20c345930c4c9de
[docs]: https://docs.camunda.org/
[docs-versions]: https://github.com/camunda/camunda-docs-manual/branches/all?query=7.
[sed]: https://www.gnu.org/software/sed/manual/sed.html
[open-pr]: https://github.com/pepopowitz/dotfiles/blob/main/git.zsh#L8
[gh-cli]: https://cli.github.com/
[cargo-culting]: https://en.wikipedia.org/wiki/Cargo_cult_programming
[capture-group]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences
[gh-arguments]: https://cli.github.com/manual/gh_pr_create
