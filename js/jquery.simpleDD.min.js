/*!
 *
 * jQuery simpleDD
 *
 * A simple jQuery drop down plugin
 *
 * @author			Tim Bennett
 * @version			1.7.2
 * @license			www.texelate.co.uk/mit-license/
 *
 * Download the latest version at www.texelate.co.uk/lab/project/simple-dd/
 *
 * Copyright (c) 2014 - 2015 Texelate Ltd, www.texelate.co.uk
 *
 */ 
 


;(function($){

	$.fn.simpleDD = function(options) {  
	
		/**
		 * Defaults
		 */
		var defaults = {  
		
			timeout:					500,
			dropdownElement:			'.simpledd-child',
			closeElement: 				'.simpledd-close',
			hoverClass:					'simpledd-over',
			closeMenusOnOutsideClick:	true,
			closeMenusOnLoad:			false, // You're probably better off using CSS to hide the menus in case JavaScript is disabled
			noScriptLink:				null,
			event:						'mouseenter',
			onInit:						function() {},
			onOpened:					function() {},
			onClosed:					function() {},
			onDestroyed:				function() {}
		
		};
		
		
		/**
		 * Options
		 */
		var options			= $.extend(defaults, options);
		var objArray		= this;
		var noScriptData	= 'simpledd-no-script-href';
		var timeoutDataAttr	= 'simpledd-timeout';
		var numElements		= this.length;
		var elementCounter  = 1;
		var isTouch         = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
		var isiOS 			= (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
		var $htmlBody		= $('html, body');
		var destroyed		= false;
		
		
		/**
		 * Close the drop down 
		 *
		 * @param   jQuery   $this   The drop down to close
		 */
		function close(_this) {
		
			var $this = $(_this);
			
			if($this.find(options.dropdownElement)
							.eq(0)
							.is(':visible') === true) {
			
				// Hide this drop down
				$this.removeClass(options.hoverClass)
					 .find(options.dropdownElement)
					 .eq(0)
					 .css('display', 'none');
				 
				// If there is a timeout set, cancel it
				if($this.data(timeoutDataAttr) !== 'null') {

					clearTimeout($this.data(timeoutDataAttr));
					$this.data(timeoutDataAttr, 'null');
			
				}
				 
				// Close callback
				options.onClosed.call(_this);
			
			}
		
		}
		
		
		/**
		 * Closes all the dropdowns
		 */
		function closeAllDropDowns() {
		
			objArray.each(function() {
			
				close(this);
			
			});
		
		}
		
		
		/**
		 * iOS will only bubble to body if cursor is set to pointer
		 * This doesn't matter since pointer can be anything on a touch device
		 * I hate agent sniffing but couldn't find any other way
		 * Hopefully, in time, this part of the code can go
		 */
		if(isiOS === true) {
		
			$htmlBody.css('cursor', 'pointer')
			         .css('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)'); // Stops content flashing when body is clicked
		
		}
		
		
		/**
		 * If it's a touch device set the event to click
		 */
		if(isTouch === true) {
		
			options.event = 'click';
		
		}
		
		
		/*
		 * Close all dropdowns when you click outside the menus
		 */			
		if(options.closeMenusOnOutsideClick === true) {
		
			// Add click handler to the entire web page
			$htmlBody.on('click', function(e) {
			
				closeAllDropDowns();
			
			});
			
			
			/**
			 * Stop propagation if clicked as the html, body close event will fire
			 */
			objArray.each(function() {
			
				$(this).on('click', function(e) {
					
				    e.stopPropagation();
				    
				});
			
			});
		
		}
		
		/**
		 * Return each object
		 */
		return this.each(function() {
		
			/**
			 * Cache this
			 * TO DO: When closing this seems to work with click and _this seems to work with mouseenter - why?
			 */
			var _this = this;


			/**
			 * Cache $(this)
			 */
			var $this = $(this);
			
			
			/**
			 * No script link
			 */
			if(options.noScriptLink !== null) {
			
				$this.find(options.noScriptLink).each(function() {
				
					var $this = $(this);
					
					$this.data(noScriptData, $this.attr('href'))
						 .attr('href', '#')
						 .on('click', function(e) {
					                   
						e.preventDefault(); 
						
					});    
				
				});
			
			}
			
			
			/**
			 * Internal close links
			 */
			$this.find(options.closeElement).each(function() {
			
				$(this).on('click', function(e) {
				
					if(options.event === 'click') {
					
						close(this);
						
					}
					else {
					
						close(_this);
					
					}
					
					// Prevent default
					e.preventDefault();
				
				});
			
			});
			
			
			/**
			 * Close menus on load
			 */
			if(options.closeMenusOnLoad === true) {
			
				closeAllDropDowns();
			
			}


			/**
			 * Mouse enter/click
			 */
			$this.on(options.event, function(e) {
			
				// Create toggle behaviour on click events
				if(options.event == 'click' && options.noScriptLink !== null && $this.find(options.dropdownElement).eq(0).is(':visible') === true) {

					close(this);
				
				}
				else {

					// Close the other drop downs
					closeAllDropDowns();
				
					// If there is a timeout set, cancel it
					if($this.data(timeoutDataAttr) !== 'null') {
	
						clearTimeout($this.data(timeoutDataAttr));
						$this.data(timeoutDataAttr, 'null');
					
					}
					
					// Show the active menu item
					$this.addClass(options.hoverClass)
					     .find(options.dropdownElement)
					     .eq(0)
					     .css('display', 'block');
					     
					// Open callback
					options.onOpened.call(this);
				
				}

			});
			
			
			/**
			 * Mouse leave
			 */
			if(isTouch === false && options.event != 'click') {
			
				$this.on('mouseleave', function() {
				
					if($this.find(options.dropdownElement)
							.eq(0)
							.is(':visible') === true) {
	
						// Set the timeout
						$this.data(timeoutDataAttr, setTimeout(function() {
						
							close(_this);
					
						}, options.timeout));
				
					}
			
				});
			
			}
			
			
			/**
			 * Increment the element counter
			 */
			elementCounter ++;
			
			
			/**
			 * onInit
			 */
			if(elementCounter === numElements) {
			
				options.onInit.call(this);
				
				// For some reason on iOS the first click doesn't work
				$htmlBody.trigger('click');
			
			}
			
			
			/**
			 * Public function to destroy
			 */
			$.fn.destroy = function() {
			
				if(destroyed === false) {
			
					// Close all drop downs
					closeAllDropDowns();
					
					objArray.each(function() {
					
						// Cache this
						var $this = $(this);
						
						// If there is a timeout set, cancel it
						if($this.data(timeoutDataAttr) !== 'null') {
						
							clearTimeout($this.data(timeoutDataAttr));
							$this.data(timeoutDataAttr, 'null');
							
						}
					
						// Re-add no script link
						if(options.noScriptLink !== null) {
						
							$this.find(options.noScriptLink)
							     .each(function() {
							
								var $this = $(this);
								
								$this.attr('href', $this.data(noScriptData))
								     .removeData(noScriptData);
							     
							});
						
						}
						
						// Remove event listener
						$this.off(options.event);
						
						// Remove html, body click
						$htmlBody.off('click');
						
						// Destroyed callback
						options.onDestroyed.call(this);
					
					});
					
					destroyed = true;
				
				}
			
			};
		
		});
	
	};

})(jQuery);