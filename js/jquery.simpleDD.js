/*!
 *
 * jQuery simpleDD
 *
 * A simple jQuery drop down plugin
 *
 * @author 			Tim Bennett
 * @version 		1.1.1
 *
 * Download the latest version at www.texelate.co.uk/lab/simple-dd/
 *
 * Open source under the MIT license:
 *
 * Copyright (c) 2014 Tim Bennett, Texelate Ltd, www.texelate.co.uk
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */ 
 


;(function($){

	$.fn.simpleDD = function(options) {  
	
		/**
		 * Defaults
		 */
		var defaults = {  
		
			timeout: 					500,
			dropdownElement: 			'.simpledd-child',
			hoverClass: 				'simpledd-over',
			keepOtherMenusOpen: 		false,
			closeMenusOnOutsideClick: 	true,
			closeMenusOnLoad: 			false, // You're probably better off using CSS to hide the menus in case JavaScript is disabled
			noScriptLink:				null,
			event:						'mouseenter'
		
		};
		
		
		/**
		 * Options
		 */
		var options 	= $.extend(defaults, options);
		var objArray	= this;


		/**
		 * Return each object
		 */
		return this.each(function() {

			/**
			 * Local plugin variables
			 */
			var $this 			= $(this); 
			var timeoutvar 		= 'simpleddtimeoutcode';
			
			
			/**
			 * No script link
			 */
			if(options.noScriptLink !== null) {
			
				$this.find(options.noScriptLink)
				     .attr('href', '#')
				     .on('click', function(e) {
				                       
					e.preventDefault();                
				                       
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
			
			})
			
			
			/**
			 * Mouse leave
			 */
			$this.on('mouseleave', function() {

				// Set the timeout
				var timeoutcode = window.setTimeout(function() {
					
					closeDropDown($this);
				
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
			 * Close the drop down 
			 * @param   jQuery   $this   The drop down to close
			 */
			function closeDropDown($this) {
				
				// Hide this drop down $thisect
				$this.removeClass(options.hoverClass)
				     .find(options.dropdownElement)
				     .eq(0)
				     .css('display', 'none');
			
			}
			
			
			/**
			 * Closes all the dropdowns
			 */
			function closeAllDropDowns() {
			
				objArray.each(function() {
				
					closeDropDown($(this));
				
				});
			
			}
		
		});			
	
	};

})(jQuery);