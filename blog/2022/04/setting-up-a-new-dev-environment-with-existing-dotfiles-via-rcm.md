---
title: Setting Up A New Dev Environment With Existing Dotfiles (via rcm)
date: 2022-04-15T15:56:03.882
tags: post
layout: blog
snippet: New job time means new dev environment time! I used RCM to save my previous dotfiles environment...what does it look like to use RCM to initialize my new environment from those existing dotfiles?
---

I started a new job recently ([as a Developer Experience Engineer at Camunda][tweet-about-new-job]!). One of my favorite things about starting a new job is setting up my dev environment. It gives me a chance to look through my previous dev environment and do some housekeeping — what do I really need to bring along with me, what can I drop, and what do I want to replace with something similar or better? It's like spring cleaning...but just like with my house, I only do it every few years.

During my previous job at Artsy, [my BFF Jon][jon] taught me all about the importance of archiving your [dotfiles][dotfiles-definition] with [rcm][rcm], as a means to (a) share cool aliases and tools with each other, and (b) make it easier to set up a new environment. "Ok cool," I said, "I'll do whatever you tell me to, Jon," and I pushed all my dotfiles to a [public repo][dotfiles].

But a dotfiles repo as a means to set up a new environment is a lot like backing up a database — if you don't _actually practice_ restoring it, how do you know what you're backing up? And how do you know if the restore will _actually work_? I'll admit that I did not really know how well transferring my dotfiles would work, as I had not practiced it. I just did what Jon told me to do...in my defense, that works out 99% of the time.

One fresh laptop later, and I've got a good idea of what this side of rcm & dotfiles management looks like. It took a journey to get there, and I'll share that in a bit — but here's a TL;DR if you don't care for drama.

## TL;DR

I settled on this process for setting up my environment with an existing dotfiles repo:

### 1. Clone my [dotfiles repo][dotfiles].

From my root:

```sh
~> git clone git@github.com:pepopowitz/dotfiles.git ./.dotfiles
```

That last argument (`./.dotfiles`) specifies a folder to clone into. My repo is named `dotfiles`, with no `.` prefix. [rcm], out of the box, wants a folder named `~/.dotfiles`, with the `.` prefix. There's a flag to tell rcm to use something different, but I don't like to argue with the robots.

### 2. Install [rcm][rcm].

I chose to install via [homebrew]. You do you.

```sh
~> brew install rcm
```

### 3. For files that should use the dotfiles repo as the source:

a. Use the [`rcup`][rcup] command to pull files from `~/.dotfiles` to the root:

```sh
~> rcup filename
```

Note that there's no `.` at the beginning of the filename when sync'ing in this direction. rcm is looking for a file in your `~/.dotfiles` repo with this name, and nothing in your repo will have the `.` prefix.

b. Make necessary adjustments to the `~/.filename` file.

c. `git commit` and `git push` from your `~/.dotfiles` repo.

### 4. For files that should use a new local file as the source

a. Use the [`mkrc`][mkrc] command to push the file from `~/` into your `~/.dotfiles` repo:

```sh
~> mkrc .filename
```

Note that there _is_ a `.` at the beginning of the filename when sync'ing in this direction. This time, rcm is looking for a file in your `~` root with this name, and your config files in `~` will all have the `.` prefix.

b. Browse the `git diff` of `~/.dotfiles` to make sure you didn't miss anything important

For example, when I did my `.zshrc` file, I noticed that git was planning to remove a few setup lines that I hadn't accounted for — a setup line for the version manager [`asdf`][asdf], a configuration setting for [oh-my-zsh] that I wanted to port to plain old zsh, and an imported file that I knew I'd eventually want.

c. `git commit` and `git push` from the `~/.dotfiles` repo.

🎉! Repeat steps 3 and 4 until everything's sync'ed up with your dotfiles repo.

---

Phew, now that half my readers got what they needed and moved on, here's a recap of my journey for those with more time.

## I don't get it, what do you mean dotfiles and what is rcm?

Okay, some definitions.

### Dotfiles

Dotfiles is a cute little name to encapsulate all those configuration files in the root of your environment, many of whose names begin with a dot (`.`). Things like `.gitconfig`, `.zshrc` or `.bashrc`, etc. These files define all the settings that make your terminal your terminal.

A nice thing to do with your dotfiles, or more specifically **the ones that don't contain sensitive data**, is to lump them into a single repo and share them on GitHub. (For the sensitive data, you should extract that stuff to a separate file that _isn't included_ in your dotfiles repo, and include it in your shell setup script. You'll have it on your machine, but no one else will ever see it.)

I say this is a nice thing to do because sharing is caring. Are you as disappointed in macos's bluetooth support as I am? [Here's an alias you can borrow to reset the coreaudio and bluetooth processes][flip-audio-table]. [Here's an alias for displaying a pretty git log tree](https://github.com/anandaroop/dotfiles/blob/master/aliases.sh#L38), demonstrating that [my friend Roop][roop] is cool and has some deep knowledge of formatting git logs.

### rcm

[rcm] is a tool you can use to maintain your dotfiles. It [sym-links] the dotfiles in your root directory to files in another folder, which you can then initialize as a git repository and push up to GitHub.

But I'm not gonna lie....those rcm docs are hard for me to read and understand. They're basically [manpages], and I don't do well with those. I can never find the information I'm looking for. And that's why I was a bit scared going through this process — yes, I can see the documentation for the tools provided by rcm....no, I can't see how they fit together in a real-world scenario.

## My journey to set up my new environment

I started with my [existing dotfiles repo][dotfiles-old]. It was very Artsy, and I wasn't sure how much I wanted to carry over. I used [oh-my-zsh] for basically only the `git` plugin, and I had a bunch of aliases that were specific to Artsy. If I'd wanted to do this quickly, I likely could have cloned the repo to `~/.dotfiles`, run one rcm command (I'm not sure which one), and called it a day. But I took my time instead. If you know me well, you're thinking "_of course_ you took your time, Steve."

As mentioned above, the first couple things I did were:

### 1. I cloned my dotfiles repo into `~./.dotfiles`

```sh
~> git clone git@github.com:pepopowitz/dotfiles.git ./.dotfiles
```

### 2. I installed [rcm]

```sh
~> brew install rcm
```

Before I could get comfortable with the process of setting up my environment based on existing dotfiles, I needed to mess around. So I experimented with some files.

### 3. I started with a file I knew I'd be overwriting: `Brewfile`.

In my dotfiles I had a file named `Brewfile`, which was a dumped homebrew bundle file containing all the tools I'd installed on my previous laptop. I used rcm's [`rcup`][rcup] command to bring it from my `~/.dotfiles` repo into `~`:

```sh
~> rcup Brewfile
```

This resulted in a `.Brewfile`, not `Brewfile`, in my root (the difference being the preceding `.`). I had hoped this rename would happen; it was nice to see it in action. rcm must assume that I want (a) the file in my root to be named with a preceding `.`, and (b) the file in my `~/.dotfiles` repo to be named without a `.`, and handle that translation for me. This step proved to me that this was the case.

Further confirmation — if I look at all the files managed by rcm, I can see how they link a file in the root with a `.` in the name to a file in `/.dotfiles` _without_ a `.`. I can see which files rcm is managing with the [lsrc command][lsrc]:

```sh
~> lsrc
/Users/stevenhicks/.Brewfile:/Users/stevenhicks/.dotfiles/Brewfile
/Users/stevenhicks/.README.md:/Users/stevenhicks/.dotfiles/README.md
/Users/stevenhicks/.aliases-force.zsh:/Users/stevenhicks/.dotfiles/aliases-force.zsh
/Users/stevenhicks/.aliases.zsh:/Users/stevenhicks/.dotfiles/aliases.zsh
/Users/stevenhicks/.functions.zsh:/Users/stevenhicks/.dotfiles/functions.zsh
/Users/stevenhicks/.gitconfig:/Users/stevenhicks/.dotfiles/gitconfig
/Users/stevenhicks/.hyper.js:/Users/stevenhicks/.dotfiles/hyper.js
/Users/stevenhicks/.pear-data:/Users/stevenhicks/.dotfiles/pear-data
```

In this case, I really just wanted to see what would happen; I knew that I didn't want the `~/.Brewfile` verbatim. So...

### 4. I got a fresh export from homebrew and replaced it:

```sh
~> rm .Brewfile
~> brew bundle dump --file=~/.Brewfile
```

`~/.Brewfile` now contained my new bundle, but the homebrew dump had replaced the sym-link from `~/.Brewfile` to `~/.dotfiles/Brewfile`. So I needed to hand control back over to rcm. To do this, I used a different command from rcm: [`mkrc`][mkrc].

```sh
~> mkrc .Brewfile
```

`mkrc` takes a file in your root (`~`), moves it to `~/.dotfiles`, and sym-links the original root file to point at the one in your `~/.dotfiles`. In this case, it points `~/.Brewfile` at `~/.dotfiles/Brewfile`.

Confirming that my `~/.dotfiles` repo included my new changes:

```sh
~> cd .dotfiles

~/.dotfiles> git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   Brewfile

no changes added to commit (use "git add" and/or "git commit -a")
```

💪🏻💪🏻💪🏻💪🏻💪🏻

### 5. I pushed my Brewfile changes up to GitHub.

```sh
~/.dotfiles> git commit -am "remove a bunch of stuff from brewfile"
~/.dotfiles> git push origin
```

I removed the output from these commands because they're pretty noisy. But while doing this, it gave me an error that I hadn't yet set up my committer name and email in a global `.gitconfig`! That makes sense — I'd not yet synced my `.gitconfig` from my dotfiles. So I did that next.

### 6. Sync `~/.dotfiles/gitconfig` into a new `~/.gitconfig`.

I kind of got lucky, since this second file was the opposite direction — whereas with `~/.Brewfile` I wanted to use a new file as the source, in this case I wanted to use the `~/.dotfiles` version as the source.

There's another rcm command for sync'ing in this direction: [rcup][rcup]. This one takes a file from the `~/.dotfiles` directory and creates a sym-link in `~` to point at it. In this case, I told it to point a sym-link from `~/.gitconfig` to `~/.dotfiles/gitconfig`:

```sh
~> rcup gitconfig
```

I then made some changes to the .gitconfig, like updating my email address and removing a couple unused aliases. These changes needed to be committed to my GitHub repo, so I did a `git commit` and a `git push`.

Like I said, I was lucky. The first two files I tried were intended to sync in opposite directions, with one being based on the dotfiles version, and one being based on a new file. At this point I was feeling pretty comfortable with the flow for the rest of my dotfiles...which I described above in the TL;DR.

---

Have you used rcm to manage your dotfiles? Am I doing something different than you are? I'd love to hear about how.

[tweet-about-new-job]: https://twitter.com/pepopowitz/status/1507005453036752903
[jon]: https://github.com/jonallured
[dotfiles-definition]: https://www.freecodecamp.org/news/dotfiles-what-is-a-dot-file-and-how-to-create-it-in-mac-and-linux/
[dotfiles]: https://github.com/pepopowitz/dotfiles
[dotfiles-old]: https://github.com/pepopowitz/dotfiles/tree/7312a92d9330966e5aeb0441160674e0175fad33
[rcm]: https://github.com/thoughtbot/rcm
[homebrew]: https://brew.sh/
[rcup]: http://thoughtbot.github.io/rcm/rcup.1.html
[lsrc]: http://thoughtbot.github.io/rcm/lsrc.1.html
[mkrc]: http://thoughtbot.github.io/rcm/mkrc.1.html
[asdf]: http://asdf-vm.com/
[oh-my-zsh]: https://ohmyz.sh/
[flip-audio-table]: https://github.com/pepopowitz/dotfiles/blob/ccf9df7045d4943ac41f15102fd309ac3a272477/aliases.zsh#L18
[roop]: https://github.com/anandaroop
[sym-links]: https://en.wikipedia.org/wiki/Symbolic_link
[manpages]: https://en.wikipedia.org/wiki/Man_page
