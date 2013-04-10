package com.braintrust.shootmanager.model;

public class Equipment extends Model {
	public Equipment(int id) {
		super(id);
	}

	private Category category;
	private String notes;
	
	public Category getCategory(){
		return this.category;
	}
	
	public void setCategory(Category category){
		this.category = category;
	}
	
	public String getNotes(){
		return this.notes;
	}
	
	public void setNotes(String notes){
		this.notes = notes;
	}
}
