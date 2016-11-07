# jQuery Breakpoint Events #

A plugin that triggers jQuery events when CSS media query breakpoints are reached, allowing for jQuery actions to be hooked to your breakpoints.

It watches a designated HTML element on the page as a "model" 

jQuery Breakpoint Events was designed with mobile-first development in mind, and 

The default settings are tuned to [Bootstrap](http://getbootstrap.com/)'s four breakpoints (`xs`, `sm`, `md`, `lg`), using Bootstrap's `.container` as the model element. If your responsive framework differs from Bootstrap in more than just terminology and breakpoint widths, this may not be the right tool for you.

### Settings ###

| Setting             | Default    | Description
|:--------------------|:-----------|:------------
| `defaultBreakpoint` | `xs`       | Name of the breakpoint to use if none of the others are matched. Typically this will be the smallest breakpoint (from width `0` to the first defined breakpoint).
| `breakpoints`       | `{'sm' : 750, 'md' : 970, 'lg' : 1170 }` | Array containing key-value pairs of the breakpoints and their pixel widths. Note that this is not necessarily the media query breakpoints themselves, but the defined width of the `modelElement` inside each breakpoint. For instance, in Bootstrap, `.container` is 1170px wide at the 1200px breakpoint to allow for a 15px gutter on both sides.
| `modelSelector`     | `'.container'` | jQuery selector for the element to use as a model.
| `eventTarget`       | `window`   | jQuery selector for the element the event should trigger on.
| `debug`             | false      | If true, write all triggered events to the browser console.


#### Retrieving or overriding a setting ####

Retrieve the current setting for `keyName`:

```jQuery(window).breakpointEvents('setting', 'keyName');```

Change the setting for `keyName` to `newValue`: (Be very, very careful with this)

```jQuery(window).breakpointEvents('setting', 'keyName', `newValue`);```

### Variables ###

These are used internally to the plugin, but can be viewed or changed at any time with the `variable` method.

| Variable            | Description
|:--------------------|:------------
| `modelWidth`        | The current width of the element matched by `modelSelector`.
| `currentView`       | The keyword for the current breakpoint view (e.g. `md`).
| `intitial`          | Whether this breakpoint 

#### Retrieving or overriding a variable ####

Retrieve the current setting for `keyName`:

```jQuery(window).breakpointEvents('setting', 'keyName');```

Change the setting for `keyName` to `newValue`: (Be very, very careful with this)

```jQuery(window).breakpointEvents('setting', 'keyName', `newValue`);```

### Methods ###

Methods are available to _get_ or _set_ a setting or variable after initialization, as well as to trigger a re-check of the current breakpoint outside.

#### Retrieve a plugin setting ####

```jQuery(window).breakpointEvents('setting', 'keyName');```

This retrieves the current setting for `keyName`.

#### Change a plugin setting ####

```jQuery(window).breakpointEvents('setting', 'keyName', `newValue`);```

This changes the setting for `keyName` to `newValue`. Be very, very careful with this!

#### Retrieve a plugin variable ####

```jQuery(window).breakpointEvents('variable', 'varName');```

This retrieves the current setting for `varName`. 

#### Change a plugin variable ####

```jQuery(window).breakpointEvents('variable', 'varName', `newValue`);```

This changes the current value for `varName` to `newValue`. Be very, very careful with this!



...to retrieve a setting or option, or:

`jQuery(window).breakpointEvents('methodName', 

### Usage ###

jQuery Breakpoint Events should be used 

Make sure to set up event listeners *before* initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is set up after JQBE in your code, it won't see that `initial` event.

It should always be attached to `window` since this is the element that receives the `resize` event that the plugin is built around.

### Why not just use JavaScript to detect window.innerWidth and hook your actions to that? ###

JavaScript's viewport detection is messy and inconsistent between browsers. Plus, since JavaScript and CSS are different engines, they are not guaranteed to detect the breakpoint at the same instant. Unless JavaScript delegates its detection to CSS, the actions will be out of sync. 

With this method, the jQuery events will trigger at the exact moment that the model's element width is changed by CSS media queries. We are essentially hooking the jQuery events directly to the media queries.

### Things to be aware of ###

Make sure to set up event listeners before initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is created after jQuery Breakpoint Events in your code, it won't detect that `initial` event for the breakpoint.

There is not a way to do a "greater than" or "less than" comparison. If you want to attach an action to `md` and up, you'd do it as follows:

```jQuery(window).on('bp:md bp:lg', function() { 
    // do stuff 
});```

Because of this, you will want to write your hooked functions in such a way that the actions are only performed once regardless of how many times the function is called. For instance, if you need to move an element to another place in the DOM on `md` and `lg`, your function should check to make sure it's not already been moved first before trying to move it.

If the `modelSelector` does not match an element on the page when the plugin is initialized, the plugin will abort early and will not listen for the `resize` event on the window. The `modelSelector` should point to an element that is always present on the page no matter what, not something that is created or removed dynamically. (However, if you'd prefer, it can be a zero-height element that exists only for this script to watch.)

### Alternative methods for detecting breakpoints with JavaScript ###

This is not new or innovative, but it is nicely packaged and easy to use. There are a few other methods to accomplish essentially the same thing. If this doesn't do the trick for you, check out one of these:

 * [Responsive Bootstrap Toolkit](https://github.com/maciej-gurban/responsive-bootstrap-toolkit) - Bases detection on HTML elements, but each breakpoint requires an element to be created on the page that exists only to be watched by the script. Does not trigger custom events.
 * [Breakpoints.js](https://github.com/xoxco/breakpoints) - Triggers jQuery events, but it uses the detected window width rather than watching an HTML element.
 * [jQuery Screen Events](https://github.com/lunsdorf/jquery-screen-events) - Full-featured and well-structured, but again, it detects based on window width rather than HTML element.
 * [Importing CSS Breakpoints Into JavaScript](https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript) - with this method, you use CSS to conditionally insert a `content` value in the `:before` pseudo-element of the `body` based on the current media query, and then use jQuery to retrieve that value. It has the advantage of allowing you to use keywords for the breakpoints without creating new elements on the page, but it's not as neatly packaged as a library and it requires some setup outside the script. Very interesting approach though.