package sc2006;

public class PasswordUtil {
    /** Generate a cryptographically secure random salt, base64-encoded. */
    public static String newSalt(){
        java.security.SecureRandom random = new java.security.SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return java.util.Base64.getEncoder().encodeToString(salt);
    }

    /** Hash password with salt using SHA-256; return hex string. */
    public static String hash(String password, String salt){
        try{
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            md.update(java.util.Base64.getDecoder().decode(salt));
            byte[] digest = md.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length*2);
            for(byte b: digest){
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e){
            throw new RuntimeException("Hashing algorithm not available", e);
        } catch (IllegalArgumentException e){
            // if salt is not valid base64, still hash with raw salt string bytes to avoid NPEs
            try{
                java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                md.update(salt.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                byte[] digest = md.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder(digest.length*2);
                for(byte b: digest){ sb.append(String.format("%02x", b)); }
                return sb.toString();
            } catch (java.security.NoSuchAlgorithmException ex){
                throw new RuntimeException("Hashing algorithm not available", ex);
            }
        }
    }
}
