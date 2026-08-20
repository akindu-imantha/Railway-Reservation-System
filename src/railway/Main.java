package railway;

// Application entry point. Java starts running from this class.
public class Main {

    // Start the railway reservation application.
    public static void main(String[] args) {

        // Create one object that owns all reservation data and menu actions.
        RailwaySystem railwaySystem = new RailwaySystem();

        // Start the command-line menu.
        railwaySystem.start();

    }

}
