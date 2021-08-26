---
title: Avoiding Test-Case Permutation Blowout
date: 2021-08-26T10:38:50.829
tags: post
layout: blog
snippet: Sometimes you want to write tests for a business rule that's based on multiple variables. Covering every possible permutation of the variables quickly becomes unsustainable. I've found myself using a different approach — one test for the positive case, and one test for each variable's negative case.
---

Sometimes you want to write a test for a business rule that's based on multiple variables. In your goal to cover the rule thoroughly, you start writing tests for each permutation of all variables. Quickly it blows up into something unsustainable. With n variables for the business rule, you get 2<sup>n</sup> permutations/test cases. This is manageable with 2 variables (4 test cases), but at 3 variables (8 test cases) it becomes ridiculous, and anything beyond that feels immediately uncomfortable.

I've noticed myself using an alternate pattern for this, which results in n+1 test cases instead of 2<sup>n</sup>. It gives good coverage despite not testing all permutations, and I actually think the test cases themselves become easier to follow. The approach looks like this:

1. Write one test that covers the positive case, where all the variables are in the correct state to make the thing happen.
2. Write one test per variable, to cover the negative case where the variable's value would cause the thing to _not_ happen.

An example: imagine we have a message that we only want to show when (a) the user is logged in, (b) they have green hair, and (c) they like bananas.

The "all permutations" approach would result in 8 tests:

```
when the user is logged in
  when the user has green hair
    when the user likes bananas
      the message appears
    when the user does not like bananas
      the message does not appear
  when the user has brown hair
    when the user likes bananas
      the message does not appear
    when the user does not like bananas
      the message does not appear
when the user is not logged in
  when the user has green hair
    when the user likes bananas
      the message does not appear
    when the user does not like bananas
      the message does not appear
  when the user has brown hair
    when the user likes bananas
      the message does not appear
    when the user does not like bananas
      the message does not appear
```

You can see in this list of test cases the inspiration for the alternate approach — there is only 1 of 8 tests that test for the positive case. The rest are all combinations of values that turn the message off.

The alternate "turn it off one variable at a time" approach results in 4 test cases:

```
when the user is logged in, has green hair, and likes bananas
  the message appears
when the user is not logged in
  the message does not appear
when the user has brown hair
  the message does not appear
when the user does not like bananas because they are some kind of monster
  the message does not appear
```

We have zero test cases for multiple fields being turned off, but that might be a _good_ thing — if multiple variables are turning the message off, you can't really say with 100% confidence that the test is passing because both fields are being checked.

I think I tend to evolve toward this latter approach even without thinking about it, but now that I've become aware of this tendency, I've been using this as a starting point instead of the "eventual evolution."
