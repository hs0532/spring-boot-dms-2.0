package com.cnki.dms.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.cnki.dms.bean.Database;
import com.cnki.dms.service.UniversityService;

/**
 * rest请求接口，为页面提供json数据查询。
 * 
 *	Create by haoshuang on 2018-08-21 09:51:40
 */
@RestController
@RequestMapping("Handler")
public class RestHandlerController {
	
	/**
	 * 日志对象
	 */
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(RestHandlerController.class);
	
	/**
	 *  数据库服务器IP地址
	 */
	@Value("${service.ip}")
	private String strMysqlSeviceIp;
	
	/**
	 *  目标服务器mysql用户名
	 */
	@Value("${service.db.username}")
	private String strMysqlUserName;
	
	/**
	 *  目标服务器mysql密码
	 */
	@Value("${service.db.password}")
	private String strMysqlPassword;
	
	@Autowired
	private UniversityService universityService;
	
	
	/**
	 * 数据库页面查询用户信息（学校）
	 * @param sn
	 * @param schoolNum     学校编号
	 * @param schoolName	学校名称
	 * @param databasestate 数据库
	 * @param page			页数
	 * @param rows			每页行数
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked"})
	@RequestMapping(value="DatabaseHandler",method=RequestMethod.POST)
	public Map listDataBase(String sn, String schoolNum, String schoolName, String databasestate,
			String page,String rows,HttpSession httpSession) {
		Map mapResult = new HashMap();

		List listDatabase = new ArrayList();
		try {
			// 校验分页参数
			if(page!=null&&!"".equals(page)){
				
			}else{
				page = "1";
			}
			
			if(rows==null||"".equals(rows)){
				rows = "10";
			}
			// 执行Service进行查询
			List<Map<String, Object>> list = universityService.listUniversity(schoolNum,schoolName,page, rows,httpSession);
			if (list==null) {
				mapResult.put("isSuccess", false);
				return mapResult;
			}
			for (Map map : list) {
				map.put("学校编号", map.get("school_id"));
				map.put("大学名称", map.get("school_name"));
				map.put("开通时间", map.get("begin_time"));
				map.put("到期时间", map.get("expire_time"));
				
				String strDBIP = (String) map.get("db_ip");
				
				if(strDBIP!=null && !"".equals(strDBIP)){
					map.put("HasDatabase", "1");
				}else{
					map.put("HasDatabase", "0");
				}
				listDatabase.add(map);
			}
			mapResult.put("isSuccess", true);
			mapResult.put("rows", listDatabase);
			mapResult.put("total", listDatabase.size());
			return mapResult;
		} catch (Exception e) {
			// TODO: handle exception
			e.getStackTrace();
			logger.error("返回查询结果异常", e);
			mapResult.put("message", "查询失败");
			mapResult.put("isSuccess", false);
			return mapResult;
		}
	}
	
	/**
	 * 新用户创建数据库接口
	 * @param database 数据库相关参数
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="CreateDataBase",method=RequestMethod.POST)
	public Map createDatabase(@RequestBody Database database,HttpSession httpSession){
		System.out.println(database.toString());
		Map map = new HashMap();
		try {
			// 初始化数据库参数,使用该对象传递选择服务器mysql用户信息
			database.setMysqlPassowrd(strMysqlPassword);
			database.setMysqlUser(strMysqlUserName);
			return universityService.createDatabase(database, httpSession);
		} catch (Exception e) {
			// TODO: handle exception
			map.put("isSuccess", false);
			map.put("message", "接口异常");
			return map;
		}
	}
	
	/**
	 * 返回所有服务器地址
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value="getDatabaseIp",method=RequestMethod.POST)
	public Map getDatabaseIp(){
		
		Map mapResult = new HashMap();
		if(strMysqlSeviceIp != null && !"".equals(strMysqlSeviceIp)){
			mapResult.put("dataList", strMysqlSeviceIp);
			mapResult.put("isSuccess", true);
		}else{
			mapResult.put("dataList", "");
			mapResult.put("isSuccess", false);
		}
		
		return mapResult;
		
	}
	/**
	 * ManagerHandler
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="ManagerHandler",method=RequestMethod.POST)
	public Map managerHandler(String sn, String schoolNum, String schoolName, String databasestate,
			String page,String rows,HttpSession httpSession){
		Map mapResult = new HashMap();

		List listDatabase = new ArrayList();
		try {
			// 校验分页参数
			if(page!=null&&!"".equals(page)){
			}else{
				page = "1";
			}
			
			if(rows==null||"".equals(rows)){
				rows = "10";
			}
			// 执行Service进行查询
			List<Map<String, Object>> list = universityService.listUniversity(schoolNum,schoolName,page, rows,httpSession);
			if (list==null) {
				mapResult.put("isSuccess", false);
				return mapResult;
			}
			for (Map map : list) {
				Map mapList = new HashMap();
			
				mapList.put("用户名", map.get("school_name"));
				mapList.put("前缀", map.get("domain"));
				mapList.put("学校编号", map.get("school_id"));
				mapList.put("检测用户名", map.get("check_username"));
				mapList.put("大学名称", map.get("school_name"));
				mapList.put("检测密码", map.get("check_password"));
				mapList.put("组号", map.get("school_name"));
				mapList.put("状态", map.get("status"));
				mapList.put("开通时间", map.get("begin_time"));
				mapList.put("到期时间", map.get("expire_time"));
				mapList.put("数据库服务器IP", map.get("db_ip"));
				mapList.put("数据库名称", map.get("db_name"));
				String strDBIP = (String) map.get("db_ip");
				
				if(strDBIP!=null && !"".equals(strDBIP)){
					mapList.put("HasDatabase", "1");
					
				}else{
					mapList.put("HasDatabase", "0");
				}
				listDatabase.add(mapList);
			}
			mapResult.put("isSuccess", true);
			mapResult.put("rows", listDatabase);
			mapResult.put("total", listDatabase.size());
			return mapResult;
		} catch (Exception e) {
			// TODO: handle exception
			e.getStackTrace();
			logger.error("返回查询结果异常", e);
			mapResult.put("message", "查询失败");
			mapResult.put("isSuccess", false);
			return mapResult;
		}
	}
	/**
	 * 返回所有服务器地址
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value="BaseSettingsHandler",method=RequestMethod.POST)
	public Map baseSettingsHandler(String action ,String sn){
		
		Map mapResult = new HashMap();
		if(strMysqlSeviceIp != null && !"".equals(strMysqlSeviceIp)){
			mapResult.put("dataList", strMysqlSeviceIp);
			mapResult.put("isSuccess", true);
		}else{
			mapResult.put("dataList", "test1");
			mapResult.put("isSuccess", false);
		}
		
		return mapResult;
		
	}

}
