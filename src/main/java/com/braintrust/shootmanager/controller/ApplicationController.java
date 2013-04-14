package com.braintrust.shootmanager.controller;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.braintrust.shootmanager.manager.PhotographerManager;
import com.braintrust.shootmanager.manager.ShootManager;
import com.braintrust.shootmanager.model.Photographer;
import com.braintrust.shootmanager.model.Shoot;
import com.google.gson.Gson;

@Controller
public class ApplicationController {
	
	private static Gson gson = new Gson();
	private static String login = null;
	private static String password = null;
	
	@RequestMapping("/")
	public ModelAndView photographer() throws Exception {
		try{
			List<Photographer> photographers = PhotographerManager.getPhotographers(login, password);
			return new ModelAndView("shootList", "photographers", photographers);
		} catch (Exception e){
			System.out.println("couldn't load database driver");           
		}
		return null;
	}
	
	@RequestMapping(value = "/getShoots")
	public @ResponseBody String getShoots(@RequestParam int pId) throws SQLException{
		try {
			List<Shoot> shoots = ShootManager.getShoots(pId, login, password); 
			
			return gson.toJson(shoots);
		} catch (Exception e){
			System.out.println("couldn't load database driver");           
		}
		return null;
	}
}