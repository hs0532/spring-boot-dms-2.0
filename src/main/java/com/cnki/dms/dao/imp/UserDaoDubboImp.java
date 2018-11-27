package com.cnki.dms.dao.imp;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.cnki.api.DBRepositoryInterface;
import com.cnki.api.User;
import com.cnki.dms.dao.UserDao;

@Service
public class UserDaoDubboImp implements UserDao{

	@Reference(version = "${demo.service.version}")
	DBRepositoryInterface dbRepository;
	
	@Override
	public User queryUser(User user,HttpSession httpSession) {
		
		
		Object [] objParam = {user.getUserName()};
		String strSQl = "select username,password,phone from user where username = ?";
		User userReturn = new User();
		try {
			user.setDbIP("192.168.100.66");
			user.setDbUsername("root");
			user.setDbPassword("root");
			user.setDbName("manager_db");
			List<Map<String, Object>> list =  dbRepository.listBySQL(strSQl, objParam, user.getDbName(),user);
			//userReturn = jdbcTemplate.queryForObject(strSQl,objParam,new UserRowMapper());
			if(list.size()>0){
				userReturn.setUserName((String) list.get(0).get("username"));
				userReturn.setPassword((String) list.get(0).get("password"));
				userReturn.setPhone((String) list.get(0).get("phone"));
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return userReturn;
	}
}
