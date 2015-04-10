/*!
 *
 * jQuery simpleDD
 *
 * A simple jQuery drop down plugin
 *
 * @author			Tim Bennett
 * @version			1.5.2
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
			hoverClass:					'simpledd-over',
			keepOtherMenusOpen:			false,
			closeMenusOnOutsideClick:	true,
			closeMenusOnLoad:			false, // You're probably better off using CSS to hide the menus in case JavaScript is disabled
			noScriptLink:				null,
			event:						'mouseenter',
			onInit:						function() {},
			onOpen:						function() {},
			onClose:					function() {},
			onDestroyed:				function() {}
		
		};
		
		
		/**
		 * Options
		 */
		var options			= $.extend(defaults, options);
		var objArray		= this;
		var noScriptData	= 'simpledd-no-script-href';
		var numElements		= this.length;
		var elementCounter  = 1;
		var timeoutvar		= 'simpleddtimeoutcode';
		
		
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
				if($this.data(timeoutvar)) {
				
					window.clearTimeout($this.data(timeoutvar));
					$this.removeData(timeoutvar);
				
				}
				
				// Show the active menu item
				$this.addClass(options.hoverClass)
				     .find(options.dropdownElement)
				     .eq(0)
				     .css('display', 'block');
				     
				// Open callback
				options.onOpen.call(this);
			
			})
			
			
			/**
			 * Mouse leave
			 */
			$this.on('mouseleave', function() {

				// Set the timeout
				var timeoutcode = window.setTimeout(function() {
					
					close($this);
				
				}, options.timeout);
				
				// Store the timeout
				$this.data(timeoutvar, timeoutcode);
			
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
				$(this).click(function(e) {
					
				    e.stopPropagation();
				    
				});
			
			}
			
			
			/**
			 * Public function to close current drop down
			 */
			$.fn.close = function() {
			
				close($(this));
			
			};
			
			
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
				options.onClose.call(this);
			
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