package com.cnki.dms.dao;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.cnki.dms.bean.Database;

public interface UniversityDao {

	public boolean updateUniversity(Database database);
	
	@SuppressWarnings("rawtypes")
	public Map queryBySQL(String sql);
	
	public List<Map<String, Object>> queryAllUniversity ();
	
	/**
	 * 学校信息查询，用于开通对比数据
	 * @param schoolNum  学校编号
	 * @param schoolName 学校名称
	 * @param strNum     起始页码
	 * @param strRow	   每页条数
	 * @return           返回list
	 */
	public List<Map<String, Object>> queryUniversity (String schoolNum,String schoolName,String strNum,String strRow,HttpSession httpSession);
	
}
