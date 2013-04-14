define('resources/javascripts/shoots', ['jquery', 'underscore', 'xooie/base', 'xooie/dialog'], function($, _, Base, Dialog){
	
	var Shoots = Base('photographers', function(){
		var self = this;
		
		this.template = _.template('<li class="shoot-list-item" data-shoot-id="<%= id %>"><a href="#" role="button" type="button" class="button"><span class="shoot-list-item-date"><%= date %></span><%= location.name %>, <%= location.state %></a></li>');
	
		this.root.on({
			shootRequest: function(event){
				self.getListContainer().html('Loading...')
			},
			
			shootUpdate: function(event, id, data){
				self.activate(id, data);
			},
			
			shootError: function(event, error){
				
			}
		});
		
		this.root.find(this.options.addShootButtonSelector)
				 .on('click', function(){
					 if (!_.isUndefined(self.activeId)) {
						 Dialog.open(0);
						 
						 $('.is-dialog-active').attr('data-photo-id', self.activeId);
					 }
				 });
	});
	
	Shoots.setDefaultOptions({
		listSelector: '[data-role="listContainer"]',
		addShootButtonSelector: '[data-role="addShoot"]'
	});
	
	Shoots.prototype.getListContainer = function(){
		return this.root.find(this.options.listSelector);
	};
	
	Shoots.prototype.activate = function(id, shoots){
		var self = this;
		
		this.activeId = id;
		
		this.getListContainer().html("");
		
		this.root.addClass('active');
		
		_.each(shoots, function(shoot){
			$(self.template(shoot)).appendTo(self.getListContainer());
		});
	};
	
	return Shoots;
});