package railway.datastructures;

import railway.model.Reservation;

public class Node {

    Reservation data;
    Node next;

    public Node(Reservation data) {
        this.data = data;
        this.next = null;
    }
}