package sc2006;

import java.util.Map;
import static sc2006.Exceptions.*;

public class AuthenticationController {

    public AuthenticationController() {}

    /** UC-1 Register */
    public User register(Map<String, Object> userData) {
        String email = str(userData.get("email"));
        String password = str(userData.get("password"));
        String name = (String) userData.get("name");
        String school = (String) userData.get("school");
        Integer gy = (Integer) userData.get("gradYear");
        int gradYear = gy == null ? 0 : gy.intValue();

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new Validation("Email and password required");
        }

        if (InMemoryStore.EMAIL_TO_USER.containsKey(email)) {
            throw new Conflict("Email already registered");
        }

        String salt = PasswordUtil.newSalt();
        String hash = PasswordUtil.hash(password, salt);
        int id = InMemoryStore.nextUserId();

        if (name == null) name = "";
        if (school == null) school = "";

        User u = new User(id, name, email, hash, salt, school, gradYear);
        InMemoryStore.USERS.put(id, u);
        InMemoryStore.EMAIL_TO_USER.put(email, id);

        return u;
    }

    /** UC-2 Login */
    public User login(String email, String password) {
        Integer id = InMemoryStore.EMAIL_TO_USER.get(email);
        if (id == null) throw new Auth("Invalid email or password");
        User u = InMemoryStore.USERS.get(id);
        String h = PasswordUtil.hash(password, u.getPasswordSalt());
        if (!h.equals(u.getPasswordHash())) throw new Auth("Invalid email or password");
        return u;
    }

    public void logout(int sessionId) { /* no-op for in-memory demo */ }

    public User findByEmail(String email){
        Integer id = InMemoryStore.EMAIL_TO_USER.get(email);
        if (id == null) throw new NotFound("No such user");
        return InMemoryStore.USERS.get(id);
    }

    public void authSuccess(String sessionToken){ /* UI/boundary uses this */ }

    public void authFailure(String message){ /* UI/boundary uses this */ }

    private static String str(Object o){ return o == null ? null : o.toString(); }
}
