---
title: Setting A Default For A Redwood CheckboxField
date: 2021-04-01T23:05:03.941
tags: post
layout: blog
snippet: I got hung up trying to set a default value for a Redwood CheckboxField. Turns out I just had the prop name wrong.
draft: false
---

[RedwoodJS](https://redwoodjs.com) supplies [many types of fields for forms](https://redwoodjs.com/docs/form.html#form), including a `CheckboxField` for emitting a..well...checkbox field. 

I recently [added a `CheckboxField` to a form for my training journal](https://github.com/pepopowitz/pendulina/pull/28/files#diff-61dbca71a04a93cffe147a9d4f3646a7bb3893efd96e98df31442e81c250aaf8R137-R142), and had some trouble setting a default value on it. 

Turns out I had the prop name incorrect. I expected it to be `defaultValue` like other form components, but the correct prop is `defaultChecked`: 

```
  <CheckboxField
    name="isKeyWorkout"
    className="rw-input"
    errorClassName="rw-input rw-input-error"
    defaultChecked={props.planWorkout?.isKeyWorkout}
  />
```

I tracked this down by looking for the original implementation of that component, and [finding a test that demonstrated the proper way to set a default value](https://github.com/redwoodjs/redwood/pull/719/files#diff-ad72b10dba26b0f02b51f33ff7d8ed95212279033a78f54fe5b3d0f8c037f881R115). 

I couldn't find this in the docs anywhere, so maybe this will help you one day when searching for "redwoodjs checkboxfield default". 