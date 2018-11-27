package com.cnki.dms.controller;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 页面选项，返回选项详细页面。
 * @author to
 *
 */
@Controller
@RequestMapping("pages")
public class PageController {
	
	/**
	 * 日志对象
	 */
	@SuppressWarnings("unused")
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(PageController.class);
	
	@RequestMapping("sms")
	public String getSms(){
		return "Sms/List";
		
	}
	
	@RequestMapping("log")
	public String getLog(){
		return "Log/List";
		
	}
	
	@RequestMapping("SqlLogList")
	public String getSqlLogList(){
		return "Log/SqlLogList";
		
	}
	@RequestMapping("ExportWordLog")
	public String getExportWordLog(){
		return "Log/ExportWordLog";
		
	}
	
	
	@RequestMapping("StatisticsList")
	public String getDataStatistics(){
		return "DataStatistics/StatisticsList";
		
	}
	
	@RequestMapping("LandingStatistics")
	public String getLandingStatistics(){
		return "DataStatistics/LandingStatistics";
		
	}
	
	@RequestMapping("DataBaseList")
	public String getDataBase(){
		return "DataBase/List";
		
	}
	
	@RequestMapping("user")
	public String getUser(){
		return "User/List";
		
	}
	
	@RequestMapping("Password")
	public String getPassword(){
		return "User/Password";
		
	}
	
	@RequestMapping("SmsUserList")
	public String getSmsUserList(){
		return "Sms/List";
		
	}
	@RequestMapping("SmsList")
	public String getSmsList(){
		return "Sms/SmsList";
		
	}
	
	@RequestMapping("PlatformsList")
	public String getPlatformsList(){
		return "Sms/PlatformsList";
		
	}
	
	

}
