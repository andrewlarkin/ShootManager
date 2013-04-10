package com.braintrust.shootmanager.model;

public class Category extends Model {
	public Category(int id) {
		super(id);
	}

	private String name;
	private String description;
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public String getDescription(){
		return this.description;
	}
	
	public void setDescription(String description){
		this.description = description;
	}
}
