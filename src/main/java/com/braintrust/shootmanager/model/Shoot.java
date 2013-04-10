package com.braintrust.shootmanager.model;

import java.sql.Date;
import java.util.List;

public class Shoot extends Model {
	public Shoot(int id) {
		super(id);
	}
	
	private Date date;
	private String weatherDesc;
	private Location location;
	private List<Equipment> equipment;
	
	public Date getDate(){
		return this.date;
	}
	
	public void setDate(Date date){
		this.date = date;
	}
	
	public String getWeatherDesc(){
		return this.weatherDesc;
	}
	
	public void setWeatherDesc(String weatherDesc){
		this.weatherDesc = weatherDesc;
	}
	
	public Location getLocation(){
		return this.location;
	}
	
	public void setLocation(Location location){
		this.location = location;
	}
	
	public List<Equipment> getEquipment(){
		return this.equipment;
	}
	
	public void addEquipment(Equipment equipment){
		this.equipment.add(equipment);
	}
	
	public void addEquipment(List<Equipment> equipment){
		this.equipment.addAll(equipment);
	}
}
