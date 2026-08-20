package railway.datastructures;

import railway.model.Passenger;
// Internal node used only by Queue to connect waiting passengers.
class QueueNode {
    Passenger data;
    QueueNode next;

    // Create a queue node with passenger data.
    public QueueNode(Passenger data) {
        this.data = data;
        this.next = null;
    }
}

// Waiting list with FIFO order: the first passenger added is served first.
public class Queue {
    private QueueNode front;
    private QueueNode rear;
    // Create an empty queue.
    public Queue() {
        front = null;
        rear = null;
    }

    // Check whether the waiting queue is empty.
    public boolean isEmpty() {
        return front == null;
    }
    // Add a passenger to the rear of the queue.
    public void enqueue(Passenger passenger) {
        QueueNode newNode = new QueueNode(passenger);
        // The first node is both the front and the rear of the queue.
        if (rear == null) {
            front = rear = newNode;
            return;
        }
        rear.next = newNode;
        rear = newNode;

    }

    // Remove and return the passenger at the front of the queue.
    public Passenger dequeue() {
        if (isEmpty()) {
            return null;
        }
        // Save the first passenger, then move the front to the next person.
        Passenger passenger = front.data;
        front = front.next;
        // After removing the final person, both ends must be empty.
        if (front == null) {
            rear = null;
        }
        return passenger;
    }

    // Display all passengers in the waiting queue.
    public void display() {
        if (isEmpty()) {
            System.out.println("Waiting List is Empty.");
            return;
        }
        QueueNode current = front;
        while (current != null) {
            current.data.displayPassenger();
            current = current.next;
        }
    }
}
