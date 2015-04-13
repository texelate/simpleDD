/*!
 *
 * jQuery simpleDD
 *
 * A simple jQuery drop down plugin
 *
 * @author			Tim Bennett
 * @version			1.6.0
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
			keepOtherMenusOpen:			false,
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
		
		
		/**
		 * Return each object
		 */
		return this.each(function() {

			/**
			 * Cache this
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
			
				var $closeLink = $(this);
				
				$closeLink.on('click', function(e) {
				
					e.preventDefault();
					
					close($this);
				
				});
			
			});
			
			
			/**
			 * Close menus on load
			 */
			if(options.closeMenusOnLoad === true) {
			
				closeAllDropDowns();
			
			}


			/**
			 * Mouse enter
			 */
			$this.on(options.event, function() {
			
				// Close the other drop downs
				if(options.keepOtherMenusOpen === false) {
				
					closeAllDropDowns();
				
				}

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
			
			})
			
			
			/**
			 * Mouse leave
			 */
			$this.on('mouseleave', function() {
				
				if($this.find(options.dropdownElement)
				        .eq(0)
				        .is(':visible') === true) {
	
					// Set the timeout
					$this.data(timeoutDataAttr, setTimeout(function() {
						
						close($this);
					
					}, options.timeout));
				
				}
			
			})
			
			
			/*
			 * Close all dropdowns when you click outside the menus
			 */
			if(options.closeMenusOnOutsideClick === true) {
			
				// Add click handler to the entire web page
				$('html').on('click', function() {
				
					closeAllDropDowns();
				
				});
				
				// Prevent the html click handler from firing if the menus are clicked
				$this.click(function(e) {
					
				    e.stopPropagation();
				    
				});
			
			}
			
			
			/**
			 * Public function to close all drop downs
			 */
			$.fn.closeAllDropDowns = function() {
			
				closeAllDropDowns();
			
			};
			
			
			/**
			 * Public function to destroy
			 */
			$.fn.destroy = function() {
			
				// Cache this
				var $this = $(this);
			
				// Close all drop downs
				closeAllDropDowns();
				
				// Re-add no script link
				if(options.noScriptLink !== null) {
				
					$this.find(options.noScriptLink).each(function() {
					
						var $this = $(this);
						
						$this.attr('href', $this.data(noScriptData))
						     .removeData(noScriptData);
					     
					});
				
				}
				
				// Remove event listener
				$this.off(options.event);
				
				// Destroyed callback
				options.onDestroyed.call(this);
			
			};
			
			
			/**
			 * Close the drop down 
			 *
			 * @param   jQuery   $this   The drop down to close
			 */
			function close($this) {
				
				// Hide this drop down $thisect
				$this.removeClass(options.hoverClass)
				     .find(options.dropdownElement)
				     .eq(0)
				     .css('display', 'none');
				     
				// Close callback
				options.onClosed.call(this);
			
			}
			
			
			/**
			 * Closes all the dropdowns
			 */
			function closeAllDropDowns() {
			
				objArray.each(function() {
				
					close($(this));
				
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
			
			}
		
		});
	
	};

})(jQuery);