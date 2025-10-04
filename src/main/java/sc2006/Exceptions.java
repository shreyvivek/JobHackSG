package sc2006;

public class Exceptions {
    public static class NotFound extends RuntimeException { public NotFound(String m){ super(m); } }
    public static class Conflict extends RuntimeException { public Conflict(String m){ super(m); } }
    public static class Validation extends RuntimeException { public Validation(String m){ super(m); } }
    public static class Auth extends RuntimeException { public Auth(String m){ super(m); } }
    public static class Service extends RuntimeException { public Service(String m){ super(m); } }
}
