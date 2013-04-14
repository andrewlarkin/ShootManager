define('resources/javascripts/shoots', ['jquery', 'underscore', 'xooie/base'], function($, _, Base){
	
	var Shoots = Base('photographers', function(){
		var self = this;
		
		this.template = _.template('<li class="shoot-list-item" data-shoot-id="<%= id %>"><a href="#" role="button" type="button" class="button"><span class="shoot-list-item-date"><%= date %></span><%= location.name %>, <%= location.state %></a></li>');
	
		this.root.on({
			shootRequest: function(event){
				self.getListContainer().html('Loading...')
			},
			
			shootUpdate: function(event, data){
				self.activate(data);
			},
			
			shootError: function(event, error){
				
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
	
	Shoots.prototype.activate = function(shoots){
		var self = this;
		
		this.getListContainer().html("");
		
		this.root.addClass('active');
		
		_.each(shoots, function(shoot){
			$(self.template(shoot)).appendTo(self.getListContainer());
		});
	};
	
	return Shoots;
});