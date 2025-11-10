package sc2006;

public class LoginPage {
    private String lastError;

    public LoginPage() {}

    public void enterCredentials(String email, String password) { /* UI capture */ }

    public User submitLogin(String email, String password) {
        try{
            return new AuthenticationController().login(email, password);
        } catch (Exceptions.Auth e){
            showError(e.getMessage());
            return null;
        }
    }

    public void showError(String message) { this.lastError = message; }
    public String getLastError(){ return lastError; }
}
