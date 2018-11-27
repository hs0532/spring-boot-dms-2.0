package com.cnki.dms.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.cnki.dms.bean.Database;


public interface UniversityService {
	
	public List<Map<String, Object>> listAllUniversity ();
	
	/**
	 * 学校信息查询，用于开通对比数据
	 * @param schoolNum  学校编号
	 * @param schoolName 学校名称
	 * @param strNum     起始页码
	 * @param strRow	   每页条数
	 * @return           返回list
	 */
	public List<Map<String, Object>> listUniversity (String schoolNum,String schoolName,String strNum,String strRow,HttpSession httpSession);

	/**
	 * 执行数据库复制
	 * @param database 数据库参数bean，包括数据库信息，需要在调用时进行也写参数的初始化
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public Map createDatabase(Database database,HttpSession httpSession);


}
