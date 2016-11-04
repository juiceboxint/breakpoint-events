/**
 * jQuery Breakpoint Events
 * v1.0.0, 11/4/2016
 * https://github.com/juiceboxint/breakpoint-events
 *
 * Copyright Kevin VandeKrol, Juicebox Interactive
 * http://juiceboxinteractive.com
 *
 * License: MIT
 */
;(function($) { 

	function Plugin(element, settings) {

		// Extend default settings with those supplied by user.
		settings = $.extend({}, $.fn['breakpointEvents'].defaults, settings);

		var $el = $(element),
			vars = {
		        el          : element,
		        currentView : settings.defaultBreakpoint,
		        initial     : true,
		        modelWidth  : 0
			};

		/**
		 * Initialize plugin.
		 * 
		 * @since  1.0.0
		 */
		function init() {

			if (typeof settings.breakpoints !== 'object') {
				console.log('Breakpoints have not been properly configured.');
				return;
			}

			if ($(settings.modelSelector).length === 0) {
				console.log('Model element not found on page.');
				return;
			}

			$(settings.modelSelector + ':first').outerWidth()

			// Attach debounced breakpoint-checking function to window resize.
			$(window).bind('resize', debounce(checkBreakpoint));

			// Trigger the initial breakpoint event when page is first loaded.
			checkBreakpoint();
		}

		/**
		 * Detect current breakpoint and trigger the corresponding jQuery custom event.
		 *
		 * @since  1.0.0
		 */
		function checkBreakpoint() {
			// Use an actual media-query-driven property of an element
			// to ensure JS and CSS are synced.
			vars.modelWidth = $(settings.modelSelector + ':first').outerWidth();

			// Loop through breakpoints and try to find a match with the model's current width.
			var foundBreakpoint = false;
			$.each(settings.breakpoints, function(breakpoint, size) {
				if (!foundBreakpoint && size === vars.modelWidth) {
					if (breakpoint !== vars.currentView) {
						if (vars.initial === false) {
							$(settings.eventTarget).trigger('bp:' + vars.currentView + ':exit');
							$(settings.eventTarget).trigger('bp:' + breakpoint + ':enter');
							if (settings.debug) {
								console.log('Triggered breakpoint event: bp:' + vars.currentView + ':exit (01)');
								console.log('Triggered breakpoint event: bp:' + breakpoint + ':enter (02)');
							}
						} else {
							$(settings.eventTarget).trigger('bp:' + breakpoint + ':initial');
							if (settings.debug) {
								console.log('Triggered breakpoint event: bp:' + breakpoint + ':initial (03)');
							}
							vars.initial = false;
						}
						vars.currentView = breakpoint;
					}
					foundBreakpoint = true;
				}
			});

			// If none of the breakpoint pixel values matched the current model width,
			// then we are on the default (smallest) breakpoint.
			if (!foundBreakpoint && vars.currentView != settings.defaultBreakpoint) {
				if (!vars.initial) {
					// Trigger exit & entry events if needed
					$(settings.eventTarget).trigger('bp:' + vars.currentView + ':exit');
					$(settings.eventTarget).trigger('bp:' + settings.defaultBreakpoint + ':enter');
					if (settings.debug) {
						console.log('Triggered breakpoint event: bp:' + vars.currentView + ':exit (04)');
						console.log('Triggered breakpoint event: bp:' + settings.defaultBreakpoint + ':enter (05)');
					}
				} else {
					// This will only trigger if something is very wrong, but it's a safeguard anyway
					$(settings.eventTarget).trigger('bp:' + settings.defaultBreakpoint + ':initial');
					if (settings.debug) {
						console.log('Triggered breakpoint event: bp:' + settings.defaultBreakpoint + ':initial (06)');
					}
					vars.initial = false;
				}
				vars.currentView = settings.defaultBreakpoint;
			} else if (vars.initial) {
				$(settings.eventTarget).trigger('bp:' + settings.defaultBreakpoint + ':initial');
				if (settings.debug) {
					console.log('Triggered breakpoint event: bp:' + settings.defaultBreakpoint + ':initial (07)');
				}
				vars.initial = false;
			}
		}


		/**
		 * Function debouncer (used for window resizing)
		 * (see http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/)
		 * 
		 * @param  {function} func       Function to execute or delay.
		 * @param  {int}      threshold  Detection period in milliseconds. (Defaults to 100)
		 * @param  {bool}     execAsap   Whether to execute the function at the beginning of
		 *                               the detection period (true) or at the end (false).
		 * @return {function}            Execution or delay of the function being debounced.
		 *
		 * @since  1.0.0
		 */
		function debounce(func, threshold, execAsap) {
			var timeout;

			return function debounced() {
				var obj = this, args = arguments;
				function delayed() {
					if (!execAsap)
						func.apply(obj, args);
					timeout = null;
				};

				if (timeout)
					clearTimeout(timeout);
				else if (execAsap)
					func.apply(obj, args);

				timeout = setTimeout(delayed, threshold || 100);
			};
		}


		/**
		 * Get/set a plugin option.
		 * Get usage: jQuery(window).breakpointEvents('option', 'key');
		 * Set usage: jQuery(window).breakpointEvents('option', 'key', 'value');
		 *
		 * @since 1.0.0
		 */
		function option(key, val) {
			if (val) {
				settings[key] = val;
			} else {
				return settings[key];
			}
		}


		/**
		 * Get/set a plugin variable.
		 * Get usage: jQuery(window).breakpointEvents('variable', 'key');
		 * Set usage: jQuery(window).breakpointEvents('variable', 'key', 'value');
		 *
		 * @since 1.0.0
		 */
		function variable(key, val) {
			if (val) {
				vars[key] = val;
			} else {
				return vars[key];
			}
		}


		/**
		 * Destroy plugin.
		 * Usage: jQuery(window).breakpointEvents('destroy');
		 *
		 * @since  1.0.0
		 */
		function destroy() {
			// Iterate over each matching element.
			$el.each(function() {
				$el.removeData('breakpointEvents');
			});
		}

		// Initialize the plugin instance.
		init();

		// Define public methods
		return {
			option: option,
			variable: variable,
			destroy: destroy,
			checkBreakpoint: checkBreakpoint
		};
	}

	/**
	 * Plugin definition.
	 */
	$.fn['breakpointEvents'] = function(settings) {
		// If the first parameter is a string, treat this as a call to a public method.
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			var returnVal;
			this.each(function() {
				// Check that the element has a plugin instance, and that the requested public method exists.
				if ($.data(this, 'breakpointEvents') && typeof $.data(this, 'breakpointEvents')[methodName] === 'function') {
					// Call the method of the plugin instance, and pass it the supplied arguments.
					returnVal = $.data(this, 'breakpointEvents')[methodName].apply(this, args);
				} else {
					throw new Error('Method ' +  methodName + ' does not exist on jQuery.breakpointEvents');
				}
			});
			if (returnVal !== undefined){
				// If the method returned a value, return the value.
				return returnVal;
			} else {
				// Otherwise, returning 'this' preserves chainability.
				return this;
			}
		// If the first parameter is an object (settings), or was omitted,
		// instantiate a new instance of the plugin.
		} else if (typeof settings === "object" || !settings) {
			return this.each(function() {
				// Only allow the plugin to be instantiated once.
				if (!$.data(this, 'breakpointEvents')) {
					// Pass settings to plugin constructor, and store plugin
					// instance in the element's jQuery data object.
					$.data(this, 'breakpointEvents', new Plugin(this, settings));
				}
			});
		}
	};

	/**
	 * Default settings, configured to work with the Bootstrap grid system.
	 * These can be overwritten when initializing the plugin by
	 * passing an object literal, or after initialization:
	 * jQuery(window).breakpointEvents('option', 'key', 'value');
	 */
	$.fn['breakpointEvents'].defaults = {
		defaultBreakpoint: 'xs',
		breakpoints: {
			'sm' : 750,
			'md' : 970,
			'lg' : 1170
		},
		modelSelector: '.container', // CSS selector for the element to use as a model
		eventTarget: window, // jQuery selector for the element the event should trigger on
		debug: false // In debug mode, write to the console each time an event is triggered.
	};

})(jQuery);