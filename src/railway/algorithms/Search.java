package railway.algorithms;

import railway.model.Reservation;

// Contains searching algorithms. Its methods are static because no object state is needed.
public class Search {

    // Search a reservation array one item at a time.
    public static Reservation linearSearch(Reservation[] reservations, int reservationId) {

        // Check each reservation from the first item to the last item.
        for (Reservation reservation : reservations) {
            if (reservation.getReservationId() == reservationId) {
                return reservation;
            }
        }

        // null means no matching reservation was found.
        return null;

    }

}
