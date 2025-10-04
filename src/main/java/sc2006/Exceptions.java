package sc2006;

public class Exceptions {
    public static class NotFound extends RuntimeException { private static final long serialVersionUID = 1L; public NotFound(String m){ super(m); } }
    public static class Conflict extends RuntimeException { private static final long serialVersionUID = 1L; public Conflict(String m){ super(m); } }
    public static class Validation extends RuntimeException { private static final long serialVersionUID = 1L; public Validation(String m){ super(m); } }
    public static class Auth extends RuntimeException { private static final long serialVersionUID = 1L; public Auth(String m){ super(m); } }
    public static class Service extends RuntimeException { private static final long serialVersionUID = 1L; public Service(String m){ super(m); } }
}
