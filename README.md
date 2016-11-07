# jQuery Breakpoint Events #

A plugin that triggers jQuery events when CSS media query breakpoints are reached, allowing for JavaScript actions to be hooked to your breakpoints.

It watches a designated HTML element on the page as a "model". When the model's width is changed via CSS media queries, this plugin triggers a series of custom events to tell you which breakpoint you're on along with some other more specific information. You can then hook functions to these events.

The default settings are tuned to the four breakpoints in [Bootstrap 3](http://getbootstrap.com/) (`xs`, `sm`, `md`, `lg`), using Bootstrap's `.container` as the model to watch. It was designed with a mobile-first approach in mind. It assumes that the smallest breakpoint is fluid and that the larger breakpoints use fixed-width outer containers. This is the most common way to do things, but if you need fluid containers, or your responsive framework differs from Bootstrap in other ways beyond just terminology and breakpoint widths, this is probably not the right tool for the job.

## Usage ##

jQuery Breakpoint Events is initialized like this:

```javascript
jQuery(document).ready(function() {
	jQuery(window).breakpointEvents({
		defaultBreakpoint: 'xs',
		breakpoints: {
			'sm' : 750,
			'md' : 970,
			'lg' : 1170
		},
		modelSelector: '.container'
	});
});
```

When a breakpoint changes, a `bp:xx` event will trigger on the `window`, where `xx` is the keyword for the breakpoint that was just entered (e.g. `bp:md`). You can hook a function to this event like this:

```javascript
jQuery(window).on('bp:md', function() {
	// do stuff
});
```

If you'd rather the event be triggered on a different element than `window`, you can pass in an `eventTarget` value on initialization.

In many situations, this single event isn't specific enough. You may need to hook a function to a breakpoint's exit irrespective of which one was entered. Or, you may need to do different things depending on whether it's the initial page load or the breakpoint was arrived at from another size. In addition to the `bp:xx` event, any of the following three events are also triggered depending on context.

  * `bp:xx:initial` indicates the breakpoint on initial page load. It's triggered immediately and only once.
  * `bp:xx:enter` indicates which breakpoint was entered and is always accompanied by a `bp:xx:exit` event.
  * `bp:xx:exit` indicates which breakpoint was left and is always accompanied by a `bp:xx:enter` event.


## Settings ##

| Setting             | Default Value    | Description
|:--------------------|:-----------|:------------
| `defaultBreakpoint` | `xs`       | Name of the breakpoint to use if none of the others are matched. Typically this will be the smallest breakpoint (from width `0` to the first defined breakpoint).
| `breakpoints`       | `{ 'sm' : 750, 'md' : 970, 'lg' : 1170 }` | Array containing key-value pairs of the breakpoints and their pixel widths. There is no limit to the number of breakpoints that can be defined, but only one can be used at a given width. This width is not necessarily the media query breakpoints themselves, but the defined width of the model element inside each breakpoint. For instance, in Bootstrap, `.container` is 1170px wide at the 1200px breakpoint to allow for a 15px gutter on both sides.
| `modelSelector`     | `'.container'` | jQuery selector for the element to use as a model.
| `eventTarget`       | `window`   | jQuery selector for the element the event should trigger on.
| `debug`             | `false`      | If true, write all triggered events to the browser console.


### Retrieving or overriding a setting ###

Retrieve the current setting for `keyName`:

```javascript
jQuery(window).breakpointEvents('setting', 'keyName');
```

Change the setting for `keyName` to `newValue`: (be very, very careful with this!)

```javascript
jQuery(window).breakpointEvents('setting', 'keyName', `newValue`);
```

## Variables ##

These are used internally to the plugin, but can be viewed or changed at any time with the `variable` method.

| Variable            | Description
|:--------------------|:------------
| `currentView`       | The keyword for the current breakpoint view (e.g. `md`).
| `intitial`          | Whether this breakpoint 
| `modelWidth`        | The current width of the element matched by `modelSelector`.

### Retrieving or overriding a variable ###

Retrieve the current setting for `keyName`:

```javascript
jQuery(window).breakpointEvents('setting', 'keyName');
```

Change the setting for `keyName` to `newValue`: (be very, very careful with this!)

```javascript
jQuery(window).breakpointEvents('setting', 'keyName', 'newValue');
```

### Methods ###

The `setting` and `variable` methods are described above. The other available method is the `refresh` method:

```javascript
jQuery(window).breakpointEvents('refresh');
```

This will recheck the model element's width and trigger the appropriate events. It's useful if the size of the model has been changed outside of the `resize` event, or if you have updated the breakpoint settings after initialization. It will only trigger events if the breakpoint has changed. It will not re-trigger the event for the current breakpoint.

### Things to be aware of ###

Make sure to set up event listeners before initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is created after jQuery Breakpoint Events in your code, it won't detect that `initial` event for the breakpoint.

There is not a way to do a "greater than" or "less than" comparison. If you want to attach an action to `md` and up, you'd want to attach the action to each event individually:

```javascript
jQuery(window).on('bp:md bp:lg', function() { 
    // do stuff 
});
```

Because of the way this is done, you will want to write your hooked functions in such a way that the actions are only performed once regardless of how many times the function is called. For instance, if you need to move an element to another place in the DOM on `md` and `lg`, your function should check to make sure it's not already been moved first before trying to move it.

If the `modelSelector` does not match an element on the page when the plugin is initialized, the plugin will abort early and will not listen for the `resize` event on the window. The `modelSelector` should point to an element that is always present on the page no matter what, not something that is created or removed dynamically. (If you'd prefer, it can be a zero-height element that exists only for this script to watch.)

### Why not just use JavaScript to detect window.innerWidth and be done with it? ###

JavaScript's viewport detection is messy and inconsistent between browsers. Also, since JavaScript and CSS are different engines, they are not guaranteed to detect the breakpoint at the same instant. Unless JavaScript delegates its detection to CSS, the actions will be out of sync. 

With this method, the jQuery events will trigger at the exact moment that the model's element width is changed by CSS media queries. We are essentially hooking the jQuery events directly to the media queries.


### Alternative methods for detecting breakpoints with JavaScript ###

This is not new or innovative, but it is nicely packaged and easy to use. There are a few other methods to accomplish essentially the same thing. If this doesn't do the trick for you, check out one of these:

 * [Responsive Bootstrap Toolkit](https://github.com/maciej-gurban/responsive-bootstrap-toolkit): Bases its detection on HTML elements, but each breakpoint requires an element to be created on the page that exists only to be watched by the script. Does not trigger custom events.
 * [Breakpoints.js](https://github.com/xoxco/breakpoints): Triggers jQuery events, but it uses the detected window width rather than watching an HTML element.
 * [jQuery Screen Events](https://github.com/lunsdorf/jquery-screen-events): Full-featured and well-structured, but again, it detects based on window width rather than HTML element.
 * [Importing CSS Breakpoints Into JavaScript](https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript): With this method, you use CSS to conditionally insert a `content` value in the `:before` pseudo-element of the `body` based on the current media query, and then use jQuery to retrieve that value. It has the advantage of allowing you to use keywords for the breakpoints without creating new elements on the page, but it's not as neatly packaged as a library and it requires some setup outside the script. Very interesting approach though.