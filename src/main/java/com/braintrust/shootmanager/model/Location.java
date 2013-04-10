package com.braintrust.shootmanager.model;

public class Location extends Model {
	public Location(int id) {
		super(id);
	}

	private String name;
	private String city;
	private String state;
	private Boolean retired;
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public String getCity(){
		return this.city;
	}
	
	public void setCity(String city){
		this.city = city;
	}
	
	public String getState(){
		return this.state;
	}
	
	public void setState(String state){
		this.state = state;
	}
	
	public Boolean getRetired(){
		return this.retired;
	}
	
	public void setRetired(Boolean retired){
		this.retired = retired;
	}
}
