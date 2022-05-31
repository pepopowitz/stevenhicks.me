---
title: Select The Email For Git Commits Based On The Current Directory
date: 2022-05-27T15:47:27.650
tags: post
layout: blog
snippet: "Work projects require git commits to be signed with my work email; I'd like commits on my personal projects to be signed with my personal email. The solution: conditional includes in my .gitconfig!"
---

My new job requires that commits in our repos are signed with our work emails. Setting the global email address is no problem:

```sh
> git config --global user.email "my.work@email.com"
```

For no important reason, other than that I believe in the sanctity and purity of a git log ([sorry, Pavlos](https://github.com/artsy/eigen/pull/5285/commits)), I decided that I want commits in my _personal_ repos to be signed with my _personal_ email.

_Heads up:_ this isn't an article about setting up _authentication_ for two different users — that is pretty well described in [this article about multiple SSH keys](https://code-maven.com/per-project-ssh-public-keys-git). This article is about using two different email addresses to sign commits.

## You could use repo-level .gitconfigs

The previously linked article mentions one way to use my personal email on my personal repos — but it requires setting the local git config on each repo. This is similar to how we set it above globally:

```sh
> git config user.email "my.personal@email.com"
```

We aren't specifying `--global` here, so it's applying the configuration change to the current repo only.

This is probably a fine way to solve the problem, but I don't like the idea of having to remember to do this for every personal repo I clone. I see a very likely future where I clone a repo, make a handful of commits and push them up, then realize they were signed with my work email. 😝

## Folder-level .gitconfigs don't exist

Structurally, I keep my projects organized in a single folder that clarifies the owner: `~/dev/personal/`, vs `~/dev/camunda/`.

I'd love to be able to create one .gitconfig in the `~/dev/personal/` folder, and have it apply to all its child repos. That's not supported, unfortunately. I guess this makes sense, as it might be asking a lot for git to crawl up the tree to find all configuration files.

## Conditional git includes FTW

We can use [conditional git includes](https://git-scm.com/docs/git-config#_conditional_includes) to solve the problem! (h/t [this StackOverflow answer](https://stackoverflow.com/a/43884702))

To use a conditional git include, you specify a condition and a path to a file. If the condition is met, the file is expanded and its contents are included in your configuration.

The condition could be something like `onbranch`, to assess which branch you're currently on, or `hasconfig:remote.*.url` to look for a specific remote URL. In our case, we'll use the `gitdir` condition to assess the repo's working directory.

We'll set this up so that the global `.gitconfig` contains my work email. If a `gitdir` condition is met based on the repo's directory, a partial `.gitconfig` will override the email with my personal one.

## The final solution

My global `.gitconfig` contains my default email address, and the conditional include:

```
[user]
  name = Steven Hicks
  email = my.work@email.com
[includeIf "gitdir:~/dev/personal/"]
  path = .gitconfig-personal
```

For any repos that are inside that `~/dev/personal/` folder, the `.gitconfig-personal` file will be applied. The `.gitconfig-personal` file contains only the properties I want to override:

```
[user]
  email = my.personal@email.com
```

## Proof

You can pass a flag to `git config` to tell it to list out the current configuration: `git config -l`.

When I'm in a work directory, this emits my default email address:

```sh
❯ git config -l

user.name=Steven Hicks
user.email=my.work@email.com
includeif.gitdir:~/dev/personal/.path=.gitconfig-personal
```

Note that the `includeif` shows up here, but the condition was not met, so it doesn't bring over the contents of the conditional file.

Most importantly, when I'm working in a personal repo, I see my personal email address:

```sh
❯ git config -l

user.name=Steven Hicks
user.email=my.work@email.com
includeif.gitdir:~/dev/personal/.path=.gitconfig-personal
user.email=my.personal@email.com
```

It actually includes _both_ email addresses...but the last one wins, and git uses my personal email address to sign the commits.

---

Is this the only way to solve this problem? Likely not. If you know of another way, [let me know](https://twitter.com/pepopowitz)!
