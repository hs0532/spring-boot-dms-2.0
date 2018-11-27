package com.cnki.dms.bean.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.cnki.dms.bean.User;

public class UserRowMapper implements RowMapper<User>{
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setUserName(rs.getString(1));
        user.setPassword(rs.getString(2));
        user.setPhone(rs.getString(3));
        return user;
    }
}