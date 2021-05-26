---
title: Syntax Highlighting Diffs In Code
date: 2021-05-26T12:24:46.699
tags: post
layout: blog
snippet: Did you know your blog's syntax highlighter probably has support for highlighting code diffs? I didn't.
tweet: Did you know your blog's syntax highlighter probably has support for highlighting code diffs? I didn't.
---

[Markdown](https://www.markdownguide.org/) is a markup language used, usually by developers, to add light-weight formatting to text. It uses symbols to represent formatted elements, like `#` to represent the `h1` on a page.

I, like many other developers with blogs, [write all my articles in Markdown][this-article]. I use [eleventy](https://11ty.dev) to turn the Markdown source files into HTML & CSS for your browser.

It took a lot for me to like Markdown. The symbols are cryptic and hard to remember at first. I grew to love it as a nice way to add light-weight formatting to my blog. It's also useful for contributing to projects on GitHub, as most communication there happens via Markdown.

## Fenced Code Blocks

A commonly used element in Markdown, especially for things like developer blogs, is the [fenced code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks). If I want to show you a block of code, in my article source I create a fenced code block with a "fence" of backticks before and after the code:

````
```
var value = 6;
```
````

When [eleventy](https://11ty.dev) builds my website, it converts that fenced code block into a `<pre><code>....</code></pre>` element. The example above looks like this:

```
var value = 6;
```

## Syntax Highlighting A Fenced Code Block

You might have noticed some nice colors in the example directly above. My website uses [highlight.js](https://highlightjs.org/) to highlight syntax of all code blocks.

In the above example, highlight.js is doing its best to interpret which language my code block is using. It looks to me like it does a nice job!

If I find that it mis-interprets a code block, I can specify a language by appending it to the fence, like this:

````
```javascript
var value = 6;
```
````

I try to always specify the language. Why? While highlight.js interprets which language syntax to use, VS Code doesn't. By specifying the language on all code blocks, I get nice syntax highlighting in my editor, too:

![Highlighted syntax in VS Code](../vs-code-highlighted.png)

## Syntax Highlighting A Code Diff

Here's the cool thing I learned today:

If you're using Markdown with syntax highlighting, there's a good chance you already have support to highlight code diffs!

Let's say I want to show you what changed in a code sample. Instead of specifying the programming language in the fenced code block, I can specify `diff`. Like the changes would be represented when running a `diff` between two files, lines removed get a `-` prefix and lines added get a `+` prefix.

For example, what if I had the value wrong in the example above? In my source I'd specify a code block like this:

````
```diff
- var value = 6;
+ var value = 7;
```
````

Because highlight.js supports `diff` as a language, it knows what to do with those lines:

```diff
- var value = 6;
+ var value = 7;
```

(Apologies to the deuteranopians out there. If it's hard to tell, that top line is rendered as red, and the bottom as green.)

## Why Am I So Excited?

I like to build [hands-on tutorials](https://github.com/artsy/relay-workshop/tree/main/src/exercises/02-Fragment-Container), and something I hadn't until now figured out is how to clearly represent removing or replacing lines. With the `diff` syntax language, I can totally do this — and I don't have to install or configure anything new to support it!

[this-article]: https://github.com/pepopowitz/stevenhicks.me/blob/main/blog/2021/05/syntax-highlighting-diffs.md
