package com.braintrust.shootmanager.controller;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.braintrust.shootmanager.model.Location;
import com.braintrust.shootmanager.model.Photographer;
import com.braintrust.shootmanager.model.Shoot;

@Controller
public class ApplicationController {
	
	@RequestMapping("/")
	public ModelAndView photographer() {
		//This code is for testing purposes only and will be replaced by the query class
		Photographer photographer = new Photographer(1);
		
		photographer.setName("Andrew Larkin");
		photographer.setRetired(false);
		
		//Lets create some fake locations
		Location capeCod = new Location(0);
		Location yosemite = new Location(1);
		Location mountWashington = new Location(2);
		
		capeCod.setName("Cape Cod National Seashore");
		capeCod.setCity("Hyannis");
		capeCod.setState("MA");
		capeCod.setRetired(false);
		
		yosemite.setName("Yosemite National Park");
		yosemite.setCity("Mariposa");
		yosemite.setState("CA");
		yosemite.setRetired(false);
		
		capeCod.setName("Mount Washington");
		capeCod.setCity("Sargent's Purchase");
		capeCod.setState("NH");
		capeCod.setRetired(false);
		
		List<Shoot> shoots = new ArrayList<Shoot>();
		
		Shoot shoot1 = new Shoot(0);
		shoot1.setDate(new Date(13501872 * 100000));
		shoot1.setLocation(capeCod);
		shoot1.setWeatherDesc("Sunny but chilly");
		shoots.add(shoot1);
		
		Shoot shoot2 = new Shoot(1);
		shoot1.setDate(new Date(13401648 * 100000));
		shoot1.setLocation(mountWashington);
		shoot1.setWeatherDesc("A beautiful day!");
		shoots.add(shoot2);
		
		Shoot shoot3 = new Shoot(2);
		shoot1.setDate(new Date(13230612 * 100000));
		shoot1.setLocation(yosemite);
		shoot1.setWeatherDesc("Cold, but clear");
		shoots.add(shoot3);
		
		photographer.addShoot(shoots);
		
		//end test code
		return new ModelAndView("photographer", "photographer", photographer);
	}
}
