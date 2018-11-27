package com.cnki.dms.controller;

import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.stereotype.Controller
public class Demo {

	@RequestMapping("/demo")
	public String demo(){
		System.out.println("one request!");
		return "Sms/List";
	}
	
}
