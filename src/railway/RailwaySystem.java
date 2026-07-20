package railway;

import railway.model.Train;
import java.util.Scanner;

public class RailwaySystem {

    Scanner sc = new Scanner(System.in);

    // Hardcoded Train Array
    Train[] trains = {

            new Train(101, "Yal Devi", "Colombo", "Jaffna", 100),

            new Train(102, "Udarata Menike", "Colombo", "Badulla", 80),

            new Train(103, "Ruhunu Kumari", "Colombo", "Matara", 120)

    };

    public void start() {

        int choice;

        do {

            System.out.println("\n==========================================");
            System.out.println("     Railway Reservation System");
            System.out.println("==========================================");

            System.out.println("1. View Trains");
            System.out.println("2. Book Ticket");
            System.out.println("3. Cancel Ticket");
            System.out.println("4. Waiting List");
            System.out.println("5. Undo Last Action");
            System.out.println("6. Search Reservation");
            System.out.println("7. Sort Reservations");
            System.out.println("8. Railway Route");
            System.out.println("9. Exit");

            System.out.print("\nEnter Choice : ");
            choice = sc.nextInt();

            switch (choice) {

                case 1:
                    viewTrains();
                    break;

                case 2:
                    System.out.println("Book Ticket Module Coming Soon...");
                    break;

                case 3:
                    System.out.println("Cancel Ticket Module Coming Soon...");
                    break;

                case 4:
                    System.out.println("Waiting List Module Coming Soon...");
                    break;

                case 5:
                    System.out.println("Undo Module Coming Soon...");
                    break;

                case 6:
                    System.out.println("Search Module Coming Soon...");
                    break;

                case 7:
                    System.out.println("Sorting Module Coming Soon...");
                    break;

                case 8:
                    System.out.println("Railway Route Module Coming Soon...");
                    break;

                case 9:
                    System.out.println("Thank You!");
                    break;

                default:
                    System.out.println("Invalid Choice!");

            }

        } while (choice != 9);

    }

    // Display Hardcoded Trains
    public void viewTrains() {

        System.out.println("\n========== Available Trains ==========\n");

        for (Train train : trains) {

            train.displayTrain();

        }

    }

}