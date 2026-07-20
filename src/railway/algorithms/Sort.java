package railway.algorithms;

import railway.model.Reservation;

public class Sort {

    // Sort reservations by reservation ID using bubble sort.
    public static void bubbleSortByReservationId(Reservation[] reservations) {

        for (int i = 0; i < reservations.length - 1; i++) {
            for (int j = 0; j < reservations.length - i - 1; j++) {
                if (reservations[j].getReservationId() > reservations[j + 1].getReservationId()) {
                    swap(reservations, j, j + 1);
                }
            }
        }
    }

    // Sort reservations by passenger name using selection sort.
    public static void selectionSortByPassengerName(Reservation[] reservations) {

        for (int i = 0; i < reservations.length - 1; i++) {
            int minIndex = i;

            for (int j = i + 1; j < reservations.length; j++) {
                String currentName = reservations[j].getPassenger().getName();
                String minName = reservations[minIndex].getPassenger().getName();

                if (currentName.compareToIgnoreCase(minName) < 0) {
                    minIndex = j;
                }
            }

            swap(reservations, i, minIndex);
        }
    }

    // Sort reservations by seat number using insertion sort.
    public static void insertionSortBySeatNo(Reservation[] reservations) {

        for (int i = 1; i < reservations.length; i++) {
            Reservation key = reservations[i];
            int j = i - 1;

            while (j >= 0 && reservations[j].getSeatNo() > key.getSeatNo()) {
                reservations[j + 1] = reservations[j];
                j--;
            }

            reservations[j + 1] = key;
        }
    }

    // Sort reservations by train number using merge sort.
    public static void mergeSortByTrainNo(Reservation[] reservations) {
        mergeSortByTrainNo(reservations, 0, reservations.length - 1);
    }

    // Recursively divide the array for merge sort.
    private static void mergeSortByTrainNo(Reservation[] reservations, int left, int right) {

        if (left >= right) {
            return;
        }

        int middle = left + (right - left) / 2;
        mergeSortByTrainNo(reservations, left, middle);
        mergeSortByTrainNo(reservations, middle + 1, right);
        merge(reservations, left, middle, right);

    }

    // Merge two sorted parts of the reservation array.
    private static void merge(Reservation[] reservations, int left, int middle, int right) {

        int leftSize = middle - left + 1;
        int rightSize = right - middle;
        Reservation[] leftArray = new Reservation[leftSize];
        Reservation[] rightArray = new Reservation[rightSize];

        for (int i = 0; i < leftSize; i++) {
            leftArray[i] = reservations[left + i];
        }

        for (int i = 0; i < rightSize; i++) {
            rightArray[i] = reservations[middle + 1 + i];
        }

        int i = 0;
        int j = 0;
        int k = left;

        while (i < leftSize && j < rightSize) {
            if (leftArray[i].getTrain().getTrainNo() <= rightArray[j].getTrain().getTrainNo()) {
                reservations[k++] = leftArray[i++];
            } else {
                reservations[k++] = rightArray[j++];
            }
        }

        while (i < leftSize) {
            reservations[k++] = leftArray[i++];
        }

        while (j < rightSize) {
            reservations[k++] = rightArray[j++];
        }

    }

    // Sort reservations by reservation ID in descending order using quick sort.
    public static void quickSortByReservationIdDescending(Reservation[] reservations) {
        quickSortByReservationIdDescending(reservations, 0, reservations.length - 1);
    }

    // Recursively partition the array for quick sort.
    private static void quickSortByReservationIdDescending(Reservation[] reservations, int low, int high) {

        if (low < high) {
            int partitionIndex = partitionDescending(reservations, low, high);
            quickSortByReservationIdDescending(reservations, low, partitionIndex - 1);
            quickSortByReservationIdDescending(reservations, partitionIndex + 1, high);
        }

    }

    // Partition reservations around a pivot for descending order.
    private static int partitionDescending(Reservation[] reservations, int low, int high) {

        int pivot = reservations[high].getReservationId();
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (reservations[j].getReservationId() > pivot) {
                i++;
                swap(reservations, i, j);
            }
        }

        swap(reservations, i + 1, high);
        return i + 1;

    }

    // Swap two reservations in the array.
    private static void swap(Reservation[] reservations, int i, int j) {

        if (i == j) {
            return;
        }

        Reservation temp = reservations[i];
        reservations[i] = reservations[j];
        reservations[j] = temp;

    }

}
