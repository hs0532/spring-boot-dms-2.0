package com.cnki.dms.dao;

import javax.servlet.http.HttpSession;

import com.cnki.api.User;

public interface UserDao {

	/**
	 * 验证用户名密码
	 * @param user
	 * @return
	 */
	public User queryUser(User user,HttpSession httpSession);
	
}
