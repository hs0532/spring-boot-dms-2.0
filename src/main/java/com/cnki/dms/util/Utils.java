package com.cnki.dms.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import com.cnki.dms.bean.DMSConstant;

/**
 * 工具类
 * @author to
 * Create by 2018/08/27
 */
@SuppressWarnings("restriction")
public class Utils {
	
	/**
	 * 发送post请求
	 * 
	 * @param strUrl    请求地址
	 * @param mapParam  参数
	 * @return			返回结果
	 */
	public static String sendPost(String strUrl,Map<String,String> mapParam){
		PrintWriter printWriter = null;
		BufferedReader bufferedReader = null;
		String result = "";
		try {
			URL url = new URL(strUrl);
			URLConnection connection = url.openConnection();
			// 设置通用请求属性
			connection.setRequestProperty("accpet", "*/*");
			connection.setRequestProperty("connection", "Keep-Alive");
			connection.setRequestProperty("user-agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
			
			//
			connection.setDoOutput(true);
			connection.setDoInput(true);
			printWriter = new PrintWriter(connection.getOutputStream());
			
			
			// 设置请求属性
			String param = "";
			if (mapParam != null && mapParam.size() > 0) {
				Iterator<String> ite = mapParam.keySet().iterator();
				while (ite.hasNext()) {
					String key = ite.next();// key
					String value = mapParam.get(key);
					param += key + "=" + value + "&";
				}
				param = param.substring(0, param.length() - 1);
			}
			// 发送请求
			printWriter.print(param);
			printWriter.flush();
			
			// 输入流
			bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
			String strLine = "";
			while((strLine = bufferedReader.readLine()) != null ){
				result += strLine; 
			}

			
		} catch (Exception e) {
			// TODO: handle exception
			result =  "{\"message\":\"POST请求出现异常！"+e.getMessage()+"\",\"isSuccess\":\"false\"}";
			e.printStackTrace();
		}
		return result;
		
	}
	
	
	/**
	 * 发送get请求
	 * 
	 * @param strURL 请求地址
	 * @return
	 */
	@SuppressWarnings("unused")
	private static String checkToken(String strURL) {

		String strResult = "";
		BufferedReader in = null;
		try {
			URL realUrl = new URL(strURL);
			// 打开和URL之间的连接
			URLConnection connection = realUrl.openConnection();
			// 设置通用的请求属性
			connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			// 建立实际的连接
			connection.connect();
			in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
			String line;
			while ((line = in.readLine()) != null) {
				strResult += line;
			}
		} catch (Exception e) {
			strResult = "{\"message\":\"发送GET请求出现异常！" + e.getMessage() + "\",\"success\":\"false\"}";
			// e.printStackTrace();

		}
		// 使用finally块来关闭输入流
		finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}

		return strResult;
	}

	
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
    

	/**
	 * 加密
	 * @param plainText 明文
	 * @param aesKey	密钥	（长度32位）
	 * @param random	是否随机初始化向量
	 * @return
	 */
	public static String AESEncrypt(String plainText, String aesKey, boolean random){
		if((plainText==null||"".equals(plainText))||(aesKey==null||"".equals(aesKey))){
			
			return null;
		}
		  try {
	            // 构造密钥生成器，指定为AES算法,不区分大小写
	            KeyGenerator keygen=KeyGenerator.getInstance("AES");
	            // 根据ecnodeRules规则初始化密钥生成器
	            // 生成一个128位的随机源,根据传入的字节数组
	            keygen.init(128, new SecureRandom(aesKey.getBytes()));
	              // 产生原始对称密钥
	            SecretKey original_key=keygen.generateKey();
	              // 获得原始对称密钥的字节数组
	            byte [] raw=original_key.getEncoded();
	            // 根据字节数组生成AES密钥
	            SecretKey key=new SecretKeySpec(raw, "AES");
	              // 根据指定算法AES自成密码器
	            Cipher cipher=Cipher.getInstance("AES");
	              // 初始化密码器，第一个参数为加密(Encrypt_mode)或者解密解密(Decrypt_mode)操作，第二个参数为使用的KEY
	            cipher.init(Cipher.ENCRYPT_MODE, key);
	            // 获取加密内容的字节数组(这里要设置为utf-8)不然内容中如果有中文和英文混合中文就会解密为乱码
	            byte [] byte_encode=plainText.getBytes("utf-8");
	            // 根据密码器的初始化方式--加密：将数据加密
	            byte [] byte_AES=cipher.doFinal(byte_encode);
	          // 将加密后的数据转换为字符串
	            //这里用Base64Encoder中会找不到包
	            //解决办法：
	            //在项目的Build path中先移除JRE System Library，再添加库JRE System Library，重新编译后就一切正常了。
	            String AES_encode=new String(new BASE64Encoder().encode(byte_AES));
	          // 将字符串返回
	            return AES_encode;
	        } catch (NoSuchAlgorithmException e) {
	            e.printStackTrace();
	        } catch (NoSuchPaddingException e) {
	            e.printStackTrace();
	        } catch (InvalidKeyException e) {
	            e.printStackTrace();
	        } catch (IllegalBlockSizeException e) {
	            e.printStackTrace();
	        } catch (BadPaddingException e) {
	            e.printStackTrace();
	        } catch (UnsupportedEncodingException e) {
	            e.printStackTrace();
	        }
	        
	        // 如果有错就返加nulll
	        return null;  
	}
	
	/**
	 * 解密
	 * @param plainText 密文
	 * @param aesKey    密钥
	 * @return          明文
	 */
    public static String AESDecrypt(String plainText, String aesKey) {
    	 try {
             // 构造密钥生成器，指定为AES算法,不区分大小写
             KeyGenerator keygen=KeyGenerator.getInstance(DMSConstant.ENCRYPT_AES_TYPE);
             // 根据ecnodeRules规则初始化密钥生成器
             // 生成一个128位的随机源,根据传入的字节数组
             SecureRandom random = SecureRandom.getInstance(DMSConstant.ENCRYPT_SHA1PRNG);
             random.setSeed(aesKey.getBytes());
             keygen.init(128, random);
             // 产生原始对称密钥
             SecretKey original_key=keygen.generateKey();
             // 获得原始对称密钥的字节数组
             byte [] raw=original_key.getEncoded();
             // 根据字节数组生成AES密钥
             SecretKey key=new SecretKeySpec(raw, DMSConstant.ENCRYPT_AES_TYPE);
             // 根据指定算法AES自成密码器
             Cipher cipher=Cipher.getInstance(DMSConstant.ENCRYPT_AES_TYPE);
             // 初始化密码器，第一个参数为加密(Encrypt_mode)或者解密(Decrypt_mode)操作，第二个参数为使用的KEY
             cipher.init(Cipher.DECRYPT_MODE, key);
             //8.将加密并编码后的内容解码成字节数组
             byte [] byte_content= new BASE64Decoder().decodeBuffer(plainText);
             /*
              * 解密
              */
             byte [] byte_decode=cipher.doFinal(byte_content);
             String AES_decode=new String(byte_decode,"utf-8");
             return AES_decode;
         } catch (NoSuchAlgorithmException e) {
             e.printStackTrace();
         } catch (NoSuchPaddingException e) {
             e.printStackTrace();
         } catch (InvalidKeyException e) {
             e.printStackTrace();
         } catch (IOException e) {
             e.printStackTrace();
         } catch (IllegalBlockSizeException e) {
             e.printStackTrace();
         } catch (BadPaddingException e) {
             e.printStackTrace();
         }
         
         //如果有错就返加nulll
         return null;         
    }
    public static String genRandomNum(int n){
  	  int  maxNum = 36;
  	  int i;
  	  int count = 0;
  	  char[] str = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
  	    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
  	    'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };	  
  	  StringBuffer pwd = new StringBuffer("");
  	  Random r = new Random();
  	  while(count < n){
  	   i = Math.abs(r.nextInt(maxNum));   
  	   if (i >= 0 && i < str.length) {
  	    pwd.append(str[i]);
  	    count ++;
  	   }
  	  }
  	  return pwd.toString();
  	}
    
    @SuppressWarnings("unchecked")
	public static <T> T sessionKey(String strKey,HttpServletRequest request){
    	return (T) request.getSession().getAttribute(strKey);
    }
    
}
