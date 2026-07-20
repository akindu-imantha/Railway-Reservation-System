package railway.datastructures;

import railway.model.Reservation;

public class LinkedList {

    private Node head;
    private int size;

    // Create an empty linked list.
    public LinkedList() {
        head = null;
        size = 0;
    }

    // Insert Reservation
    public void insert(Reservation reservation) {

        Node newNode = new Node(reservation);

        if (head == null) {
            head = newNode;
            size++;
            return;
        }

        Node current = head;

        while (current.getNext() != null) {
            current = current.getNext();
        }

        current.setNext(newNode);
        size++;

    }

    // Display All Reservations
    public void display() {

        if (head == null) {
            System.out.println("No Reservations Found.");
            return;
        }

        Node current = head;

        while (current != null) {

            current.getData().displayReservation();

            current = current.getNext();

        }

    }

    // Search Reservation
    public Reservation search(int reservationId) {

        Node current = head;

        while (current != null) {

            if (current.getData().getReservationId() == reservationId) {

                return current.getData();

            }

            current = current.getNext();

        }

        return null;

    }

    // Delete Reservation
    public boolean delete(int reservationId) {

        if (head == null)
            return false;

        if (head.getData().getReservationId() == reservationId) {

            head = head.getNext();
            size--;
            return true;

        }

        Node current = head;

        while (current.getNext() != null) {

            if (current.getNext().getData().getReservationId() == reservationId) {

                current.setNext(current.getNext().getNext());
                size--;

                return true;

            }

            current = current.getNext();

        }

        return false;

    }

    // Return the number of reservations in the list.
    public int size() {
        return size;
    }

    // Convert the linked list into a reservation array.
    public Reservation[] toArray() {

        Reservation[] result = new Reservation[size];
        Node current = head;
        int index = 0;

        while (current != null) {
            result[index++] = current.getData();
            current = current.getNext();
        }

        return result;

    }

    // Search a reservation using passenger ID.
    public Reservation searchByPassengerId(int passengerId) {

        Node current = head;

        while (current != null) {
            if (current.getData().getPassenger().getPassengerId() == passengerId) {
                return current.getData();
            }
            current = current.getNext();
        }

        return null;

    }

    // Search a reservation using passenger NIC.
    public Reservation searchByNic(String nic) {

        Node current = head;

        while (current != null) {
            if (current.getData().getPassenger().getNic().equalsIgnoreCase(nic)) {
                return current.getData();
            }
            current = current.getNext();
        }

        return null;

    }

    // Check whether a seat is already booked for a train.
    public boolean isSeatBooked(int trainNo, int seatNo) {

        Node current = head;

        while (current != null) {
            Reservation reservation = current.getData();

            if (reservation.getTrain().getTrainNo() == trainNo
                    && reservation.getSeatNo() == seatNo) {
                return true;
            }

            current = current.getNext();
        }

        return false;

    }

}
