package com.braintrust.shootmanager.model;

public class PhotoEquipment extends Equipment {
	public PhotoEquipment(int id) {
		super(id);
	}

	private String model;
	private String brand;
	
	public String getModel(){
		return this.model;
	}
	
	public void setModel(String model){
		this.model = model;
	}
	
	public String getBrand(){
		return this.brand;
	}
	
	public void setBrand(String brand){
		this.brand = brand;
	}
}
