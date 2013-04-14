define('resources/javascripts/photographers', ['jquery', 'xooie/base'], function($, Base){
	var Photographers = Base('photographers', function(){
		var self = this;
		
		this.root.find(this.options.photoButtonSelector)
				 .on('click', function(event){
					 if (self.retrievingShoots){
						 return;
					 }
					 
					 var id = parseInt($(this).attr(self.options.photoIdAttr), 10);
					 
					 self.getShoots(id);
				 });
	});
	
	Photographers.setDefaultOptions({
		photoButtonSelector: '[data-role="photographer-button"]',
		photoButtonSelectedClass: 'selected',
		photoIdAttr: 'data-photographer-id',
			
		shootContainerSelector: '#shoots'
	});
	
	Photographers.prototype.getShoots = function(id){
		var self = this;
		//ajax request to retrieve shoots from server
		this.retrievingShoots = true;
		
		$.ajax({
			url: "getShoots",
			data: {
				pId: id
			},
			complete: function(){
				self.retrievingShoots = false;
			},
			
			success: function(data, status, xhr){
				$(self.options.shootContainerSelector).trigger('update', data);
			},
			
			error: function(xhr, status, errorThrown){
				$(self.options.shootContainerSelector).trigger('error', errorThrown);
			}
		});
	};
	
	return Photographers;
});