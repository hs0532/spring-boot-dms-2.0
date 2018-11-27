package com.cnki.dms.service.imp;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnki.dms.bean.DMSConstant;
import com.cnki.dms.bean.Database;
import com.cnki.dms.dao.UniversityDao;
import com.cnki.dms.service.UniversityService;
import com.cnki.dms.util.Utils;
import com.cnki.dms.util.WindowsUtils;
/**
 * 处理查询数据加密 格式等问题
 * @author to
 *
 */
@Service
public class UniversityServiceImp implements UniversityService {
	
	/**
     * 日志对象
     */
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UniversityServiceImp.class);
    
	
	@Autowired
	private UniversityDao universityDao;
	
	@Override
	public List<Map<String, Object>> listAllUniversity() {
		
		
		// TODO Auto-generated method stub
		return universityDao.queryAllUniversity();
	}
	
	
	@Override
	public List<Map<String, Object>> listUniversity(String schoolNum,String schoolName,String strNum, String strRow,HttpSession httpSession) {
		
		return universityDao.queryUniversity(schoolNum, schoolName, strNum, strRow,httpSession);
		
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public Map createDatabase(Database database,HttpSession httpSession) {
		
		Map mapResult= new HashMap();
		// 新建库用户名
		String strNewSCDBUsername = DMSConstant.DB_NAME_MASTER_START+database.getOldSchoolNum();
		// 新建库密码
		String strNewSCDBpassword = Utils.genRandomNum(8);
		// 新建库名称
		String strNewSCDBName = DMSConstant.DB_NAME_MASTER_START+database.getOldSchoolNum()+DMSConstant.DB_NAME_MASTER_END;
		// 标准库数据库名
		String strOldDBName = "";
		// 标准库用户名
		String strOldDBUserName = "";
		// 标准库密码
		String strOldDBPassword = "";
		
		// 此处newSchoolNum为标准库学校编号。
		List<Map<String, Object>> list = universityDao.queryUniversity(database.getNewSchoolNum(), null, "1", "1",httpSession);
		
		if(list!=null&&list.size()>0){
			// 从数据库读取 标准库 (旧)用户名密码,并对数据进行解密操作
			
			strOldDBName = list.get(0).get("db_name")+"";
			
			strOldDBUserName = Utils.AESDecrypt(list.get(0).get("db_user")+"", DMSConstant.AES_KEY);
			
			strOldDBPassword = Utils.AESDecrypt(list.get(0).get("db_password")+"", DMSConstant.AES_KEY);
		}else{
			mapResult.put(DMSConstant.RETURN_SUCCESS, false);
			mapResult.put("message", "查询学校信息出错");
			return mapResult;
		}
		
		try {
			logger.info("load mysqlDriver>>>>>>>>>>");
			/**
			 * 创建数据库
			 * 
			 */
			Class.forName("com.mysql.cj.jdbc.Driver");
			
			 // 必须填一个已经存在的数据库 
		    String url = "jdbc:mysql://"+database.getOldServerIp()+":"+database.getPort()+"/mysql?"
		    		+ "characterEncoding=utf-8&serverTimezone=GMT%2B8&&useSSL=false";   
		    
		    logger.info("connect mysql database>>>>>>>>>>");
		    java.sql.Connection conn = DriverManager.getConnection(url,database.getMysqlUser() ,database.getMysqlPassowrd()); 
		    Statement stat = conn.createStatement();
		    logger.info("create mysql database>>>>>>>>>>");   
		    
		    // 创建数据库
		    int intResult = stat.executeUpdate("create database  if not exists "+strNewSCDBName); 
		    if(intResult >= 0){
		    	// 创建新数据库用户名密码
		    	intResult =  stat.executeUpdate("create USER "+strNewSCDBUsername+" IDENTIFIED by '"+strNewSCDBpassword+"';");
		    	
		    	if(intResult >= 0){
		    		// 数据库授权
		    		intResult = stat.executeUpdate("GRANT ALL ON "+strNewSCDBName+".* TO '"+strNewSCDBUsername+"'@'%';");
		    	}
		    	
		    }
		    //关闭数据库 
		    stat.close(); 
		    if(intResult >= 0){
		    	 logger.info("copy mysql database>>>>>>>>>>");  
		    	 // 复制数据库
		    	 /*mysqldump -h 192.168.100.66 -d  master_main_db -uroot -proot --add-drop-table 
		    	  * | mysql -h 127.0.0.1 master_main_db -uroot -proot*/
		    	StringBuffer strBuffer = new StringBuffer();
				strBuffer.append("cmd /c mysqldump -h ");
				strBuffer.append(list.get(0).get("db_ip")+" -d "+strOldDBName);
				strBuffer.append(" -u"+strOldDBUserName+" -p"+strOldDBPassword+" --add-drop-table | mysql -h ");
				strBuffer.append(database.getOldServerIp()+" ");
				strBuffer.append(strNewSCDBName);
				strBuffer.append(" -u"+strNewSCDBUsername+" -p"+strNewSCDBpassword);
				// 复制数据库执行
				if(WindowsUtils.execCMD(strBuffer.toString())){
					logger.info("update university>>>>>>>>>>");  
					
				    // database传递新创建数据库加密存储
				    database.setMysqlUser(Utils.AESEncrypt(strNewSCDBUsername, DMSConstant.AES_KEY, false));
					database.setMysqlPassowrd(Utils.AESEncrypt(strNewSCDBpassword, DMSConstant.AES_KEY, false));
					database.setDbName(strNewSCDBName);
				    // 更新用户开通数据库后的信息
					if(universityDao.updateUniversity(database)){
						mapResult.put(DMSConstant.RETURN_SUCCESS, true);
						mapResult.put(DMSConstant.RETURN_MESSAGE, "复制成功");
						return mapResult;
					}else{
						mapResult.put(DMSConstant.RETURN_SUCCESS, false);
						mapResult.put(DMSConstant.RETURN_MESSAGE, "数据库初始化后更新用户信息失败");
						return mapResult;
					}
				}else{
					mapResult.put(DMSConstant.RETURN_SUCCESS, false);
					mapResult.put(DMSConstant.RETURN_MESSAGE, "数据库初始化失败");
					return mapResult;
				}
		    }else{
		    	mapResult.put(DMSConstant.RETURN_SUCCESS, false);
				mapResult.put(DMSConstant.RETURN_MESSAGE, "数据库初始化失败");
				return mapResult;
		    }
		    
			
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			logger.error("加载数据库驱动异常",e);
			mapResult.put(DMSConstant.RETURN_SUCCESS, false);
			mapResult.put(DMSConstant.RETURN_MESSAGE, "加载数据库驱动异常");
			return mapResult;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			logger.error("SQL异常",e);
			mapResult.put(DMSConstant.RETURN_SUCCESS, false);
			mapResult.put(DMSConstant.RETURN_MESSAGE, "数据库操作异常");
			return mapResult;
		} catch (Exception e) {
			// TODO: handle exception
			mapResult.put(DMSConstant.RETURN_SUCCESS, false);
			mapResult.put(DMSConstant.RETURN_MESSAGE, "数据库操作异常");
			return mapResult;
		}
	}

}
