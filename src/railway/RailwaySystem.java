package railway;

import railway.algorithms.Sort;
import railway.datastructures.BST;
import railway.datastructures.Graph;
import railway.datastructures.HashTable;
import railway.datastructures.LinkedList;
import railway.datastructures.Queue;
import railway.datastructures.Stack;
import railway.model.Passenger;
import railway.model.Reservation;
import railway.model.Train;

import java.util.Scanner;

public class RailwaySystem {

    private Scanner sc = new Scanner(System.in);
    private int nextPassengerId = 1, nextReservationId = 1001;

    private LinkedList reservations = new LinkedList();
    private Queue waitingQueue = new Queue();
    private Stack undoStack = new Stack();
    private BST reservationTree = new BST();
    private HashTable passengers = new HashTable();
    private Graph graph;

    private Train[] trains = {
            new Train(101, "Yal Devi", "Colombo", "Jaffna", 100),
            new Train(102, "Udarata Menike", "Colombo", "Badulla", 80),
            new Train(103, "Ruhunu Kumari", "Colombo", "Matara", 120)
    };

    // Initialize the railway system with default route data.
    public RailwaySystem() {
        initRoutes();
    }

    // Run the main menu loop until the user exits.
    public void start() {

        int choice;
        do {
            menu();
            choice = readInt("Enter Choice : ");

            switch (choice) {
                case 1: viewTrains(); break;
                case 2: bookTicket(); break;
                case 3: cancelTicket(); break;
                case 4: reservations.display(); break;
                case 5: waitingQueue.display(); break;
                case 6: undoLastCancel(); break;
                case 7: passengerMenu(); break;
                case 8: searchReservation(); break;
                case 9: sortReservations(); break;
                case 10: routeMenu(); break;
                case 11: System.out.println("Thank You..."); break;
                default: System.out.println("Invalid Choice!");
            }
        } while (choice != 11);

    }

    // Display all main menu options.
    private void menu() {
        System.out.println("\n========== Railway Reservation System ==========");
        System.out.println("1. View Trains");
        System.out.println("2. Book Ticket");
        System.out.println("3. Cancel Ticket");
        System.out.println("4. View Reservations");
        System.out.println("5. Waiting List");
        System.out.println("6. Undo Last Cancel");
        System.out.println("7. Passenger Management");
        System.out.println("8. Search Reservation");
        System.out.println("9. Sort Reservations");
        System.out.println("10. Railway Route");
        System.out.println("11. Exit");
    }

    // Display every train in the train array.
    private void viewTrains() {
        for (Train train : trains) {
            train.displayTrain();
        }
    }

    // Book a ticket or add the passenger to the waiting queue if the train is full.
    private void bookTicket() {

        viewTrains();
        Train train = findTrain(readInt("Train Number : "));

        if (train == null) {
            System.out.println("Invalid Train Number!");
            return;
        }

        if (train.getAvailableSeats() == 0) {
            waitingQueue.enqueue(readPassenger());
            System.out.println("Train Full. Passenger Added To Waiting List.");
            return;
        }

        int seatNo = readInt("Seat Number : ");
        if (!validSeat(train, seatNo)) {
            return;
        }

        Reservation reservation = addReservation(readPassenger(), train, seatNo);
        System.out.println("Reservation Successful. ID : " + reservation.getReservationId());

    }

    // Cancel an existing reservation and assign the seat to waiting passengers if available.
    private void cancelTicket() {

        int id = readInt("Reservation ID : ");
        Reservation reservation = reservations.search(id);

        if (reservation == null || !reservations.delete(id)) {
            System.out.println("Reservation Not Found!");
            return;
        }

        reservationTree.delete(id);
        reservation.getTrain().cancelSeat();

        if (waitingQueue.isEmpty()) {
            undoStack.push(reservation);
            System.out.println("Reservation Cancelled.");
            return;
        }

        addReservation(waitingQueue.dequeue(), reservation.getTrain(), reservation.getSeatNo());
        System.out.println("Cancelled seat assigned to first waiting passenger.");

    }

    // Restore the most recently cancelled reservation when the seat is still free.
    private void undoLastCancel() {

        if (undoStack.isEmpty()) {
            System.out.println("Nothing to Undo!");
            return;
        }

        Reservation reservation = undoStack.peek();
        Train train = reservation.getTrain();

        if (train.getAvailableSeats() == 0 || reservations.isSeatBooked(train.getTrainNo(), reservation.getSeatNo())) {
            System.out.println("Cannot undo. Seat is not available.");
            return;
        }

        undoStack.pop();
        reservations.insert(reservation);
        reservationTree.insert(reservation);
        train.bookSeat();
        System.out.println("Reservation Restored. ID : " + reservation.getReservationId());

    }

    // Show passenger management options.
    private void passengerMenu() {

        System.out.println("\n1. View All Passengers");
        System.out.println("2. Search By Passenger ID");
        int choice = readInt("Choice : ");

        if (choice == 1) {
            passengers.display();
        } else if (choice == 2) {
            Passenger passenger = passengers.search(readInt("Passenger ID : "));
            if (passenger == null) System.out.println("Passenger Not Found!");
            else passenger.displayPassenger();
        } else {
            System.out.println("Invalid Choice!");
        }

    }

    // Search reservations using BST or linked-list based search.
    private void searchReservation() {

        System.out.println("\n1. Search By Reservation ID (BST)");
        System.out.println("2. Search By NIC (Linked List)");
        int choice = readInt("Choice : ");

        Reservation reservation = null;
        if (choice == 1) {
            reservation = reservationTree.search(readInt("Reservation ID : "));
        } else if (choice == 2) {
            reservation = reservations.searchByNic(readLine("NIC : "));
        }

        if (reservation == null) System.out.println("Reservation Not Found!");
        else reservation.displayReservation();

    }

    // Sort reservations using selected sorting algorithm.
    private void sortReservations() {

        Reservation[] data = reservations.toArray();

        if (data.length == 0) {
            System.out.println("No Reservations Found.");
            return;
        }

        System.out.println("\n1. By Reservation ID");
        System.out.println("2. By Passenger Name");
        System.out.println("3. By Seat Number");

        switch (readInt("Choice : ")) {
            case 1: Sort.bubbleSortByReservationId(data); break;
            case 2: Sort.selectionSortByPassengerName(data); break;
            case 3: Sort.insertionSortBySeatNo(data); break;
            default:
                System.out.println("Invalid Choice!");
                return;
        }

        for (Reservation reservation : data) {
            reservation.displayReservation();
        }

    }

    // Show route display and shortest-path options.
    private void routeMenu() {

        System.out.println("\n1. Display Routes");
        System.out.println("2. Shortest Path");

        if (readInt("Choice : ") == 1) {
            graph.displayRoutes();
        } else {
            graph.shortestPath(readLine("Source : "), readLine("Destination : "));
        }

    }

    // Create and store a reservation in all required data structures.
    private Reservation addReservation(Passenger passenger, Train train, int seatNo) {

        Reservation reservation = new Reservation(nextReservationId++, passenger, train, seatNo);
        reservations.insert(reservation);
        reservationTree.insert(reservation);
        train.bookSeat();
        return reservation;

    }

    // Read passenger details and store the passenger in the hash table.
    private Passenger readPassenger() {

        Passenger passenger = new Passenger(
                nextPassengerId++,
                readLine("Passenger Name : "),
                readLine("NIC : "),
                readLine("Phone : ")
        );

        passengers.insert(passenger);
        return passenger;

    }

    // Validate seat number and prevent duplicate seat bookings.
    private boolean validSeat(Train train, int seatNo) {

        if (seatNo < 1 || seatNo > train.getTotalSeats()) {
            System.out.println("Invalid Seat Number!");
            return false;
        }

        if (reservations.isSeatBooked(train.getTrainNo(), seatNo)) {
            System.out.println("Seat Already Booked!");
            return false;
        }

        return true;

    }

    // Find a train by train number.
    private Train findTrain(int trainNo) {

        for (Train train : trains) {
            if (train.getTrainNo() == trainNo) {
                return train;
            }
        }

        return null;

    }

    // Read an integer from the console with validation.
    private int readInt(String message) {

        while (true) {
            System.out.print(message);
            if (sc.hasNextInt()) {
                int value = sc.nextInt();
                sc.nextLine();
                return value;
            }

            System.out.println("Enter a valid number.");
            sc.nextLine();
        }

    }

    // Read a non-empty line of text from the console.
    private String readLine(String message) {

        String value;
        do {
            System.out.print(message);
            value = sc.nextLine().trim();
        } while (value.isEmpty());

        return value;

    }

    // Create the default graph routes between stations.
    private void initRoutes() {

        graph = new Graph(new String[] {
                "Colombo", "Kandy", "Badulla", "Galle", "Matara", "Anuradhapura", "Jaffna"
        });

        graph.addEdge("Colombo", "Kandy", 115);
        graph.addEdge("Kandy", "Badulla", 165);
        graph.addEdge("Colombo", "Galle", 119);
        graph.addEdge("Galle", "Matara", 45);
        graph.addEdge("Colombo", "Anuradhapura", 206);
        graph.addEdge("Anuradhapura", "Jaffna", 198);

    }

}
