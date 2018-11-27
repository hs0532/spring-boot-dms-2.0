package com.cnki.dms.util;

import java.security.MessageDigest;

import com.cnki.dms.bean.DMSConstant;


public class MD5Util {


	
    /**
     * MD5加密算法
     * @param str   需要转化为MD5码的字符串
     * @return  返回一个32位16进制的字符串
     */
    public static String toMd5(String str) {
        MessageDigest md5 = null;  
        try{  
            md5 = MessageDigest.getInstance(DMSConstant.MD5);  
        }catch (Exception e){  
            System.out.println(e.toString());  
            e.printStackTrace();  
            return "";  
        }  
        char[] charArray = str.toCharArray();  
        byte[] byteArray = new byte[charArray.length];  
  
        for (int i = 0; i < charArray.length; i++)  
            byteArray[i] = (byte) charArray[i];  
        byte[] md5Bytes = md5.digest(byteArray);  
        StringBuffer hexValue = new StringBuffer();  
        for (int i = 0; i < md5Bytes.length; i++){  
            int val = ((int) md5Bytes[i]) & 0xff;  
            if (val < 16)  
                hexValue.append("0");  
            hexValue.append(Integer.toHexString(val));  
        }  
        return hexValue.toString();  

    }
}