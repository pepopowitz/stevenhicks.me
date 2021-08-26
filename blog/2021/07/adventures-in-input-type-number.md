---
title: Adventures In <input type="number">
date: 2021-07-13T11:27:31.099
tags: post
layout: blog
snippet: The one that shows on the homepage
tagline: The one that shows at the top of the post
draft: false
---

Working on an input form recently, I learned that `<input type="number">` is not what I thought it was.

As a mainly Chrome user, my experience with `<input type="number">` is that it blocks non-numeric input. For the form we were working on, we thought the browser's built-in prevention of non-numeric input would give us all the protection we needed for our numeric fields.

We were wrong! Here's what it looks like when you try to type non-numeric input into `<input type="number">` on Firefox: 

(todo: video of firefox input type=number)

You can type literally anything into it. Is this a bug????

Like anything in software, the answer is "it depends." In this case, it depends on your interpretation of the HTML specification.

## What does MDN say about `<input type="number">`?

It's not the official specification, but the [MDN Web Docs][MDN] are an authoritative voice when it comes to web development. This was my first stop in my research:

> `<input>` elements of type number are used to let the user enter a number. They include built-in validation to reject non-numerical entries. The browser may opt to provide stepper arrows to let the user increase and decrease the value using their mouse or by tapping with a fingertip.

_Source: [MDN Web Docs][MDN]_

My initial read of this was focused on "They include built-in validation to reject non-numerical entries." Aha! It's a bug, it's not validating the input!

Before filing a bug with Mozilla, I wanted to confirm there wasn't one already open. I'm surely not the first person to run into this. 

I found several! [One in particular was very helpful][bug], as it provided a different perspective to my interpretation that Firefox is not validating `<input type="number">`: 

> You're reading too much into the spec text. The specification (and WHATWG/W3C specification is general) do not dictate UI/UX. When the spec says that the value cannot be set to a non-numeric value, it is referring to the internal value of the control, not its visual appearance.

_Source: [Bugzilla][bug]_

And what does the WHATWG spec HTML spec say?



Well....it is, actually. Validation is not prevention. 



> The value sanitization algorithm is as follows: If the value of the element is not a valid floating-point number, then set it to the empty string instead.

_Source: [WHATWG][WHATWG]_

> Constraint validation: While the user interface describes input that the user agent cannot convert to a valid floating-point number, the control is suffering from bad input.

_Source: [WHATWG][WHATWG]_



Fun bonus note from the spec:

> The type=number state is not appropriate for input that happens to only consist of numbers but isn't strictly speaking a number. For example, it would be inappropriate for credit card numbers or US postal codes. A simple way of determining whether to use type=number is to consider whether it would make sense for the input control to have a spinbox interface (e.g. with "up" and "down" arrows). Getting a credit card number wrong by 1 in the last digit isn't a minor mistake, it's as wrong as getting every digit incorrect. So it would not make sense for the user to select a credit card number using "up" and "down" buttons. When a spinbox interface is not appropriate, type=text is probably the right choice (possibly with an inputmode or pattern attribute).
  
Something about input type number for phone numbers or credit cards

[MDN]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
[WHATWG]: https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number)
[bug]: https://bugzilla.mozilla.org/show_bug.cgi?id=1398528#c3