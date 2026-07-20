package railway.algorithms;

import railway.model.Reservation;

public class Search {

    // Search a reservation array one item at a time.
    public static Reservation linearSearch(Reservation[] reservations, int reservationId) {

        for (Reservation reservation : reservations) {
            if (reservation.getReservationId() == reservationId) {
                return reservation;
            }
        }

        return null;

    }

}
