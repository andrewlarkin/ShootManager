package com.braintrust.shootmanager.model;

public class MiscEquipment extends Equipment {
	public MiscEquipment(int id) {
		super(id);
	}

	private String name;
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name = name;
	}
}
