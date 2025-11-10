package sc2006;

import java.util.Objects;

public class User {
    private int userId;
    private String name;
    private String email;
    private String passwordHash;   // hashed
    private String passwordSalt;   // salt (base64)
    private String school;
    private int gradYear;

    public User(){}

    public User(int userId, String name, String email, String passwordHash, String passwordSalt, String school, int gradYear) {
        this.userId = userId;
        this.name = Objects.requireNonNullElse(name, "");
        this.email = Objects.requireNonNull(email, "email");
        this.passwordHash = Objects.requireNonNull(passwordHash, "passwordHash");
        this.passwordSalt = Objects.requireNonNull(passwordSalt, "passwordSalt");
        this.school = Objects.requireNonNullElse(school, "");
        this.gradYear = gradYear;
    }

    public int getUserId(){ return userId; }
    public String getName(){ return name; }
    public String getEmail(){ return email; }
    public String getPasswordHash(){ return passwordHash; }
    public String getPasswordSalt(){ return passwordSalt; }
    public String getSchool(){ return school; }
    public int getGradYear(){ return gradYear; }

    public void setName(String name){ this.name = Objects.requireNonNullElse(name, ""); }
    public void setSchool(String school){ this.school = Objects.requireNonNullElse(school, ""); }
    public void setGradYear(int gradYear){ this.gradYear = gradYear; }

    @Override public boolean equals(Object o){ return (o instanceof User u) && u.userId==this.userId; }
    @Override public int hashCode(){ return Objects.hash(userId); }
    @Override public String toString(){ return "User{id=%d,email=%s}".formatted(userId,email); }
}
