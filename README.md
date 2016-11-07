# jQuery Breakpoint Events #

A plugin that triggers jQuery events when CSS media query breakpoints are reached, allowing for jQuery actions to be hooked to your breakpoints.

It watches a designated HTML element on the page as a "model" 

jQuery Breakpoint Events was designed with mobile-first development in mind, and 

The default settings are tuned to [Bootstrap](http://getbootstrap.com/)'s four breakpoints (`xs`, `sm`, `md`, `lg`), using Bootstrap's `.container` as the model element. If your responsive framework differs from Bootstrap in more than just terminology and breakpoint widths, this may not be the right tool for you.

### Settings ###

| Setting             | Default    | Description
|:--------------------|:-----------|:------------
| `defaultBreakpoint` | `xs`       | Name of the breakpoint to use if none of the others are matched. Typically this will be the smallest breakpoint (from width `0` to the first defined breakpoint).
| `breakpoints`       | `{'sm' : 750, 'md' : 970, 'lg' : 1170 }` | Array containing key-value pairs of the breakpoints and their pixel widths. The pixel widths should be the defined width of the `modelElement`. For instance, in Bootstrap, `.container` is 1170px wide at the 1200px breakpoint to allow for a 15px gutter on both sides.
| `current`           | Function   | Returns the name of the current breakpoint or `true` or `false` if an optional `name` argument was given.
| `debug`             | false      | If true, write all triggered events to the browser console.

### Methods ###

;lskdnf

### Usage ###

jQuery Breakpoint Events should be used 

Make sure to set up event listeners *before* initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is set up after JQBE in your code, it won't see that `initial` event.

It should always be attached to `window` since this is the element that receives the `resize` event that the plugin is built around.

### Why not just use JavaScript to detect window.innerWidth and hook your actions to that? ###

JavaScript's viewport detection is messy and inconsistent between browsers. Plus, since JavaScript and CSS are different engines, they are not guaranteed to detect the width at the same instant. Unless JavaScript delegates its detection to CSS, the actions will be out of sync. 

With this method, the jQuery events will trigger at the exact moment that the model's element width is changed by CSS media queries. We are essentially hooking the jQuery events directly to the media queries.

### Things to be aware of ###

Make sure to set up event listeners before initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is created after jQuery Breakpoint Events in your code, it won't detect that `initial` event for the breakpoint.

If the `modelSelector` does not match an element on the page when the plugin is initialized, the plugin will abort early and will not listen for the `resize` event on the window. The `modelSelector` should point to an element that is always present on the page no matter what, not something that is created or removed dynamically. (However, if you'd prefer, it can be a zero-height element that exists only for this script to watch.)

### Alternative methods for detecting breakpoints with JavaScript ###

This is not new or innovative, but it is nicely packaged and easy to use. There are a few other methods to accomplish essentially the same thing. If this doesn't do the trick for you, check out one of these:

 * [Responsive Bootstrap Toolkit](https://github.com/maciej-gurban/responsive-bootstrap-toolkit) - Bases detection on HTML elements, but each breakpoint requires an element to be created on the page that exists only to be watched by the script. Does not trigger custom events.
 * [Breakpoints.js](https://github.com/xoxco/breakpoints) - Triggers jQuery events, but it uses the detected window width rather than watching an HTML element.
 * [jQuery Screen Events](https://github.com/lunsdorf/jquery-screen-events) - Full-featured and well-structured, but again, it detects based on window width rather than HTML element.
 * [Importing CSS Breakpoints Into JavaScript](https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript) - with this method, you use CSS to insert a `content`
his literally queries the CSS breakpoint via JavaScript by 
Not as neatly packaged, but an interesting approach.