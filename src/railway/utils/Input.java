package railway.utils;

import java.util.Scanner;

// Holds one shared Scanner that can read keyboard input from the console.
public class Input {

    // "static" means other classes can use Input.sc without creating Input first.
    public static Scanner sc = new Scanner(System.in);

}
