package railway.model;

public class Reservation {

    private int reservationId;
    private Passenger passenger;
    private Train train;
    private int seatNo;

    // Create a reservation for a passenger, train, and seat number.
    public Reservation(int reservationId,
                       Passenger passenger,
                       Train train,
                       int seatNo) {

        this.reservationId = reservationId;
        this.passenger = passenger;
        this.train = train;
        this.seatNo = seatNo;
    }

    // Return the reservation ID.
    public int getReservationId() {
        return reservationId;
    }

    // Return the passenger linked to this reservation.
    public Passenger getPassenger() {
        return passenger;
    }

    // Return the train linked to this reservation.
    public Train getTrain() {
        return train;
    }

    // Return the booked seat number.
    public int getSeatNo() {
        return seatNo;
    }

    // Print reservation details to the console.
    public void displayReservation() {

        System.out.println("==============================");
        System.out.println("Reservation ID : " + reservationId);
        System.out.println("Passenger      : " + passenger.getName());
        System.out.println("Train          : " + train.getTrainName());
        System.out.println("Seat Number    : " + seatNo);
        System.out.println("==============================");

    }

}
