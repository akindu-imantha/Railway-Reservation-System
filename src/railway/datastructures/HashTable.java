package railway.datastructures;

import railway.model.Passenger;

public class HashTable {

    private static class Entry {
        Passenger passenger;
        Entry next;

        // Create a hash-table entry with passenger data.
        Entry(Passenger passenger) {
            this.passenger = passenger;
        }
    }

    private static final int DEFAULT_CAPACITY = 31;
    private Entry[] table;

    // Create an empty hash table.
    public HashTable() {
        table = new Entry[DEFAULT_CAPACITY];
    }

    // Insert or update a passenger using passenger ID as the key.
    public void insert(Passenger passenger) {

        int index = hash(passenger.getPassengerId());
        Entry current = table[index];

        while (current != null) {
            if (current.passenger.getPassengerId() == passenger.getPassengerId()) {
                current.passenger = passenger;
                return;
            }
            current = current.next;
        }

        Entry entry = new Entry(passenger);
        entry.next = table[index];
        table[index] = entry;

    }

    // Delete a passenger from the hash table by passenger ID.
    public void delete(int passengerId) {

        int index = hash(passengerId);
        Entry current = table[index];
        Entry previous = null;

        while (current != null) {
            if (current.passenger.getPassengerId() == passengerId) {
                if (previous == null) {
                    table[index] = current.next;
                } else {
                    previous.next = current.next;
                }
                return;
            }

            previous = current;
            current = current.next;
        }

    }

    // Search a passenger by passenger ID.
    public Passenger search(int passengerId) {

        int index = hash(passengerId);
        Entry current = table[index];

        while (current != null) {
            if (current.passenger.getPassengerId() == passengerId) {
                return current.passenger;
            }
            current = current.next;
        }

        return null;

    }

    // Search a passenger by NIC.
    public Passenger searchByNic(String nic) {

        for (Entry entry : table) {
            Entry current = entry;
            while (current != null) {
                if (current.passenger.getNic().equalsIgnoreCase(nic)) {
                    return current.passenger;
                }
                current = current.next;
            }
        }

        return null;

    }

    // Display all passengers stored in the hash table.
    public void display() {

        boolean found = false;

        for (Entry entry : table) {
            Entry current = entry;
            while (current != null) {
                current.passenger.displayPassenger();
                found = true;
                current = current.next;
            }
        }

        if (!found) {
            System.out.println("No Passengers Found.");
        }

    }

    // Convert a key into a table index.
    private int hash(int key) {
        return Math.abs(key) % table.length;

    }

}
