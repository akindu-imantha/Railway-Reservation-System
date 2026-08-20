package railway.datastructures;
import railway.model.Reservation;
// Stores cancelled reservations using LIFO order: last cancelled, first restored.
public class Stack {
    private Node top;
    // Create an empty stack.
    public Stack() {
        top = null;
    }
    // Push Reservation to Stack
    public void push(Reservation reservation) {
        Node newNode = new Node(reservation);
        // The new item becomes the top and points to the old top.
        newNode.setNext(top);
        top = newNode;
    }

    // Pop Reservation from Stack
    public Reservation pop() {
        if (isEmpty()) {
            System.out.println("Stack is Empty!");
            return null;
        }
        // Save the top value, then move top one item down.
        Reservation reservation = top.getData();
        top = top.getNext();
        return reservation;
    }

    // View Top Reservation
    public Reservation peek() {
        if (isEmpty()) {
            return null;
        }
        return top.getData();
    }

    // Check Stack Empty
    public boolean isEmpty() {
        return top == null;
    }
    // Display Stack
    public void display() {
        if (isEmpty()) {
            System.out.println("Stack is Empty!");
            return;
        }
        Node current = top;
        System.out.println("\n===== Undo Stack =====");
        while (current != null) {
            current.getData().displayReservation();
            current = current.getNext();
        }
    }
}
