package com.cnki.dms.dao.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.cnki.api.DBRepositoryInterface;
import com.cnki.api.User;
import com.cnki.dms.bean.Database;
import com.cnki.dms.dao.UniversityDao;
/**
 * 执行数据库查询
 * @author to
 *
 */
@Service
public class UniversityDaoImp implements UniversityDao {

	/**
     * 日志对象
     */
    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UniversityDaoImp.class);
    
    @Reference(version = "${demo.service.version}")
	DBRepositoryInterface dbRepository;
    
    
    public UniversityDaoImp() {
		// TODO Auto-generated constructor stub
	}
    @SuppressWarnings("rawtypes")
	@Override
    public Map queryBySQL(String sql) {
    	// TODO Auto-generated method stub
    	return null;
    }
    
	@Override
	public List<Map<String, Object>> queryAllUniversity() {
		String strSQL = "select * from university where id=?";
		Object[] objParam =  {"0"};
		// TODO Auto-generated method stub
		return dbRepository.listBySQL(strSQL, objParam, "master_main_db",new User());
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<Map<String, Object>> queryUniversity(String schoolNum, String schoolName, String strNum, String strRow,HttpSession httpSession) {
		// 将页码转换为起始数字
		int pages = (Integer.parseInt(strNum)-1)*Integer.parseInt(strRow);
		// SQl
		StringBuffer strBuffer = new StringBuffer();
		List listParam  = new ArrayList();
		try {	
			strBuffer.append("select * from university");
			// 判断条件是否存d在
			if (schoolNum != null && !"".equals(schoolNum)) {
				listParam.add(schoolNum);
				strBuffer.append(" where school_id = ?");
				if (schoolName != null && !"".equals(schoolName)) {
					listParam.add(schoolName);
					strBuffer.append(" and school_name = ?");
				}
			} else if (schoolName != null && !"".equals(schoolName)) {
				listParam.add(schoolName);
				strBuffer.append(" where school_name = ?");
			}
			strBuffer.append(" order by school_id ASC limit ?,?");
			logger.info("start query listUniversity method!");
			listParam.add(pages);
			listParam.add(Integer.parseInt(strRow));
			return dbRepository.listBySQL(strBuffer.toString(), listParam.toArray(),"master_main_db",new User());
			
			
		} catch (Exception e) {
			// TODO: handle exception
			logger.error("查询Service异常" + e.getMessage());
			return null;
		}
	}
	
	@Override
	public boolean updateUniversity(Database database){
		boolean flag = false;
		try {
			
			StringBuffer stringBuffer = new StringBuffer();
			stringBuffer.append("update university set ");
			stringBuffer.append("db_ip = ?,db_name = ?");
			stringBuffer.append(",db_user = ?,db_password = ?");
			stringBuffer.append(" where school_id = ?");
			Object[] objParam = { database.getOldServerIp(), database.getDbName(), database.getMysqlUser(),
					database.getMysqlPassowrd(), database.getOldSchoolNum() };
			
			flag = dbRepository.updateBySQL(stringBuffer.toString(),objParam, "master_main_db");
					
		} catch (Exception e) {
			// TODO: handle exception
			return flag;
		}
		return flag;
	}
}
