package iv;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
 


import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;

public class crypto {

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		encrypt_3des_cbc();

	}
	/*
	public static void encrypt_3des_ecb() throws Exception {
		byte[] key = "0123456789abcd0123456789".getBytes();		
		byte[] plainText = "123456789".getBytes();
		
		
//		KeySpec myKeySpec = new DESedeKeySpec(key);
//		SecretKeyFactory mySecretKeyFactory = SecretKeyFactory.getInstance("DESede");
//		SecretKey secretKey = mySecretKeyFactory.generateSecret(myKeySpec);
		SecretKey secretKey = new SecretKeySpec(key, "DESede");
		//encrypt
		Cipher cipher = Cipher.getInstance("DESede/ECB/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, secretKey);
		byte[] encryptedData = cipher.doFinal(plainText);
		System.out.println("encrypt_3des_ecb: " + Hex.encodeHexString(encryptedData));
		
		//decrypt
		cipher.init(Cipher.DECRYPT_MODE, secretKey);
		byte[] decryptPlainText = cipher.doFinal(encryptedData);
	
	}
	*/
	
	public static void encrypt_3des_cbc() throws Exception {
		byte[] key = "0123456789abcd0123456789".getBytes();
		String Text =  "/login?{\"credential\":\"fEqNCco3Yq9h5ZUglD3CZJT4lBs=\",\"username\":\"feng-jin.deng@ivision-china.cn\",\"chin\":\"中文翻译sfd\"}";
		Base64 base64 = new Base64();
		Text = base64.encodeToString(Text.getBytes("UTF-8"));
		System.out.println("after base64 decode: " + Text);
		
		byte[] plainText = Text.getBytes();
		//byte[] plainText = "{\"errno\":\"300\",\"errmsg\":\"User InValid\",\"queryresult\":null,\"module\":\"login\"}".getBytes();
		
		IvParameterSpec iv = new IvParameterSpec("12345678".getBytes());
		
		SecretKey secretKey = new SecretKeySpec(key, "DESede");
		//encrypt
		Cipher cipher = Cipher.getInstance("DESede/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
		byte[] encryptedData = cipher.doFinal(plainText);
		System.out.println("encrypt_3des_cbc: " + Hex.encodeHexString(encryptedData));
		
		//decrypt
		cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
		//String te = "9dbdcd109cbf715973576fb8258196c9eba9a7bc06ee3c2caa6c18e23e52b2709e38f5c14209f9d52ae4ae19092d700e8dcd402920f6ad38695f024b49484b98b68aa8e7fec2b5b9cb794d3c88d5539a";
		byte[] decryptPlainText = cipher.doFinal(encryptedData);
		//byte[] decryptPlainText = cipher.doFinal(te.getBytes());
		System.out.println("解密后的base64结果  :" + new String(decryptPlainText, "UTF8"));
		Text = new String (Base64.decodeBase64(new String(decryptPlainText, "UTF8")),"UTF8");
		System.out.println("decrypt_3des_cbc: " + Text);
			
	}	
 /*
	public void encrypt_des_ecb() throws Exception {
		byte[] key = "01234567".getBytes();		
		byte[] plainText = "1234567812345678".getBytes();
		
		SecretKey secretKey = new SecretKeySpec(key, "DES");
		//encrypt
		Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, secretKey);		
		byte[] encryptedData = cipher.doFinal(plainText);
		System.out.println("encrypt_des_ecb: " + Hex.encodeHexString(encryptedData));
		
		//decrypt
		cipher.init(Cipher.DECRYPT_MODE, secretKey);
		byte[] decryptPlainText = cipher.doFinal(encryptedData);
		
	}
	
	public void encrypt_des_cbc() throws Exception {
		byte[] key = "01234567".getBytes();		
		byte[] plainText = "1234567812345678".getBytes();
		IvParameterSpec iv = new IvParameterSpec("12345678".getBytes()); 
		
		SecretKey secretKey = new SecretKeySpec(key, "DES");
		//encrypt
		Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);		
		byte[] encryptedData = cipher.doFinal(plainText);
		System.out.println("encrypt_des_cbc: " + Hex.encodeHexString(encryptedData));
		
		//decrypt
		cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
		byte[] decryptPlainText = cipher.doFinal(encryptedData);
		
	}	
*/
}
