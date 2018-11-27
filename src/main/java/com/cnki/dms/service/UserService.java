package com.cnki.dms.service;

import java.util.Map;

import javax.servlet.http.HttpSession;

import com.cnki.api.User;


public interface UserService {
	@SuppressWarnings("rawtypes")
	public Map verifyLogin(User user,HttpSession httpSession);
	
}
