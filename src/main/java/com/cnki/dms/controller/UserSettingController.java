package com.cnki.dms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("User")
public class UserSettingController {
	
	/**
	 * 基本设置
	 * @return
	 */
	@RequestMapping("BaseSettings")
	public String BaseSettings(){
		return "User/BaseSettings";
	}
	

	/**
	 * 查看课题字典
	 * @return
	 */
	@RequestMapping("SubjectDictList")
	public String SubjectDictList(){
		return "User/SubjectDictList";
	}

	/**
	 * 查看公告字典
	 * @return
	 */
	@RequestMapping("NoticeDictList")
	public String NoticeDictList(){
		return "User/NoticeDictList";
	}
	/**
	 * 查看角色
	 * @return
	 */
	@RequestMapping("RoleList")
	public String RoleList(){
		return "User/RoleList";
	}
	/**
	 * 成绩名称
	 * @return
	 */
	@RequestMapping("ResultsNameList")
	public String ResultsNameList(){
		return "User/ResultsNameList";
	}
	
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping("CreateTemplates")
	public String CreateTemplates(){
		return "User/CreateTemplates";
	}
	
	

	/**
	 * 
	 * @return
	 */
	@RequestMapping("SchoolWeight")
	public String SchoolWeight(){
		return "User/SchoolWeight";
	}
	

	/**
	 * 
	 * @return
	 */
	@RequestMapping("DesignTableModel")
	public String DesignTableModel(){
		return "User/DesignTableModel";
	}
	


	

	/**
	 * 
	 * @return
	 */
	@RequestMapping("CustomAudit")
	public String CustomAudit(){
		return "User/CustomAudit";
	}
	

	/**
	 * 
	 * @return
	 */
	@RequestMapping("CheckStatistics")
	public String CheckStatistics(){
		return "User/CheckStatistics";
	}
	

	/**
	 * 
	 * @return
	 */
	@RequestMapping("SearchList")
	public String SearchList(){
		return "User/SearchList";
	}
	

	/**
	 * 
	 * @return
	 */
	@RequestMapping("ExcelModelList")
	public String ExcelModelList(){
		return "User/ExcelModelList";
	}
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping("MenuModule")
	public String MenuModule(){
		return "User/MenuModule";
	}
	
	
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping("ImportProjects")
	public String ImportProjects(){
		return "User/ImportProjects";
	}
}
