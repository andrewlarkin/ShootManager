define('resources/javascripts/add_shoot', ['jquery', 'xooie/addons/base', 'xooie/dialog'], function($, Base, Dialog){
	var AddShoot = Base('addShoot', function(){
		var self = this;
		
		this.module.root.find(this.options.formSelector)
						.on('submit', function(event){
							event.preventDefault();
							
							self.sendData(this);
						});
	});
	
	AddShoot.setDefaultOptions({
		submitSelector: '[data-role="submitButton"]',
		formSelector: '[data-role="form"]'
	});
	
	AddShoot.prototype.sendData = function(form_data){
		var photoId = parseInt(this.module.root.attr('data-photo-id'), 10),
			i, shoot, self = this;
		
		/*shoot = {
				data: form_data.date.value,
				weatherDesc: form_data.weather.value,
				photographerId: photoId,
				locationId: form_data.location.value,
				equipmentIds: []
		};
		
		for (i=0; i < form_data.equipment.length;i+=1){
			shoot.equipmentIds.push(form_data.equipment[i].value);
		}*/
		
		shoot = $(form_data).serialize();
		
		$.ajax({
			type: 'POST',
			url: 'addShoot',
			data: shoot,
			dataType: 'json',
			complete: function(){
				Dialog.close(self.module.id);
			},
			
			success: function(){
				console.log('successful');
			},
			
			error: function(){
				console.log('error!');
			}
		});
	};	
	
	return AddShoot;
});