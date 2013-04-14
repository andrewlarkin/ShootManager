define('resources/javascripts/photographers', ['jquery', 'xooie/base'], function($, Base){
	var Photographers = Base('photographers', function(){
		var self = this;
		
		this.root.find(this.options.photoButtonSelector)
				 .on('click', function(event){
					 if (self.retrievingShoots){
						 return;
					 }
					 
					 var id = parseInt($(this).attr(self.options.photoIdAttr), 10);
					 
					 self.getShoots(id, $(this));
				 });
	});
	
	Photographers.setDefaultOptions({
		photoButtonSelector: '[data-role="photographer-button"]',
		selectedClass: 'selected',
		photoIdAttr: 'data-photographer-id',
			
		shootContainerSelector: '#shoots'
	});
	
	Photographers.prototype.getShoots = function(id, button){
		var self = this;
		//ajax request to retrieve shoots from server
		this.retrievingShoots = true;
		
		self.root.find('.' + this.options.selectedClass).removeClass(this.options.selectedClass);
		button.addClass(self.options.selectedClass);
		
		$(this.options.shootContainerSelector).trigger('shootRequest');
		
		$.ajax({
			url: "getShoots",
			data: {
				pId: id
			},
			complete: function(){
				self.retrievingShoots = false;
			},
			
			success: function(data, status, xhr){
				$(self.options.shootContainerSelector).trigger('shootUpdate', [id, JSON.parse(data)]);
			},
			
			error: function(xhr, status, errorThrown){
				$(self.options.shootContainerSelector).trigger('shootError', errorThrown);
			}
		});
	};
	
	return Photographers;
});