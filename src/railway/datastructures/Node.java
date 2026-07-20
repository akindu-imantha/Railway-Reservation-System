package railway.datastructures;

import railway.model.Reservation;

public class Node {

    private Reservation data;
    private Node next;

    // Create a linked-list node with reservation data.
    public Node(Reservation data) {
        this.data = data;
        this.next = null;
    }

    // Return the reservation stored in this node.
    public Reservation getData() {
        return data;
    }

    // Update the reservation stored in this node.
    public void setData(Reservation data) {
        this.data = data;
    }

    // Return the next node reference.
    public Node getNext() {
        return next;
    }

    // Update the next node reference.
    public void setNext(Node next) {
        this.next = next;
    }

}
