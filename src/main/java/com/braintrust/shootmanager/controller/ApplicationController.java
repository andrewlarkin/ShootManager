package com.braintrust.shootmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.braintrust.shootmanager.manager.PhotographerManager;
import com.braintrust.shootmanager.model.Photographer;

@Controller
public class ApplicationController {
	
	@RequestMapping("/")
	public ModelAndView photographer() {
		Photographer photographer = PhotographerManager.getPhotographer();
		return new ModelAndView("shootList", "photographer", photographer);
	}
}
