package railway.datastructures;
// Stores unique NIC values in a custom hash set.
// It uses an array and linear probing when two NICs map to the same position.
public class HashSetCustom {
    private static final int DEFAULT_CAPACITY = 31;
    private String[] data = new String[DEFAULT_CAPACITY];
    private int size;
    // Add a NIC to the custom hash set if it does not already exist.
    public boolean add(String nic) {
        if (nic == null || nic.trim().isEmpty() || contains(nic)) {
            return false;
        }
        // Create more space before the internal array becomes completely full.
        if (size == data.length) {
            resize();
        }
        int index = findSlot(nic);
        data[index] = nic;
        size++;
        return true;

    }
    // Check whether a NIC exists in the hash set.
    public boolean contains(String nic) {
        if (nic == null) {
            return false;
        }
        // The hash code gives the first array position to inspect.
        int index = Math.abs(nic.toLowerCase().hashCode()) % data.length;
        for (int i = 0; i < data.length; i++) {
            // Move forward one position at a time and wrap around when needed.
            int probe = (index + i) % data.length;
            if (data[probe] == null) {
                return false;
            }
            if (data[probe].equalsIgnoreCase(nic)) {
                return true;
            }
        }
        return false;
    }
    // Find an empty slot for a NIC using linear probing.
    private int findSlot(String nic) {
        int index = Math.abs(nic.toLowerCase().hashCode()) % data.length;
        while (data[index] != null) {
            index = (index + 1) % data.length;
        }
        return index;
    }
    // Increase the hash set capacity and reinsert existing NIC values.
    private void resize() {
        // Re-hash every old NIC because its index may change in the larger array.
        String[] oldData = data;
        data = new String[oldData.length * 2];
        size = 0;
        for (String nic : oldData) {
            if (nic != null) {
                add(nic);
            }
        }
    }
}
