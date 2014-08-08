package iv;

import java.io.IOException;	
import java.security.NoSuchAlgorithmException;



public class SHA1 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String password = "123456";				
        try {
			String shaPwdString = "{SHA}:  "			
			        + new sun.misc.BASE64Encoder().encode(java.security.MessageDigest.getInstance("SHA1").digest(password.getBytes()));
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}			


	}
	
	

}
