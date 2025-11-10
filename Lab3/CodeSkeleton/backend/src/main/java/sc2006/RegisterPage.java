package sc2006;

import java.util.Map;

public class RegisterPage {

    public RegisterPage() {}

    public void enterRegistrationDetails(Map<String,Object> userData) { /* UI capture */ }

    public User submitRegistration(Map<String,Object> userData) {
        return new AuthenticationController().register(userData);
    }

    public void showConfirmation(){ /* UI */ }
}
