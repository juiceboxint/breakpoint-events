# jQuery Breakpoint Events #

A plugin that triggers jQuery events when CSS media query breakpoints are reached, allowing for jQuery actions to be hooked to your breakpoints.

It watches a designated HTML element on the page as a "model" 

jQuery Breakpoint Events was designed with mobile-first development in mind, and 

The default settings are designed for [Bootstrap](http://getbootstrap.com/)'s four breakpoints (`xs`, `sm`, `md`, `lg`), using Bootstrap's `.container` as the model element. If your responsive framework differs from Bootstrap in more than just terminology and breakpoint widths, this may not be the right tool for you.

### Usage ###

jQuery Breakpoint Events should be used 

Make sure to set up event listeners *before* initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is set up after JQBE in your code, it won't see that `initial` event.

It should always be attached to `window` since this is the element that receives the `resize` event that the plugin is built around.

### Why not just use JavaScript to detect window.innerWidth and hook your actions to that? ###

JavaScript's viewport detection is messy and inconsistent between browsers. Plus, since JavaScript and CSS are different engines, they are not guaranteed to detect the width at the same instant. Unless JavaScript delegates its detection to CSS, the actions will be out of sync. 

With this method, the jQuery events will trigger at the exact moment that the model's element width is changed by CSS media queries. We are essentially hooking the jQuery events directly to the media queries.

### Things to be aware of ###

Make sure to set up event listeners *before* initializing jQuery Breakpoint Events. The `bp:xx:initial` event is triggered immediately upon initialization, so if an event listener is created after jQuery Breakpoint Events in your code, it won't detect that `initial` event for the breakpoint.

If the `modelSelector` does not find an element on the page when the plugin is initialized, the plugin will abort early and will not listen for the `resize` event on the window. The `modelSelector` should point to an element that is always present on the page no matter what - not something that is created or removed dynamically.