package railway.model;

public class Reservation {

    private int reservationId;
    private Passenger passenger;
    private Train train;
    private int seatNo;

    public Reservation(int reservationId,
                       Passenger passenger,
                       Train train,
                       int seatNo) {

        this.reservationId = reservationId;
        this.passenger = passenger;
        this.train = train;
        this.seatNo = seatNo;
    }

    public int getReservationId() {
        return reservationId;
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public Train getTrain() {
        return train;
    }

    public int getSeatNo() {
        return seatNo;
    }

    public void displayReservation() {

        System.out.println("==============================");
        System.out.println("Reservation ID : " + reservationId);
        System.out.println("Passenger      : " + passenger.getName());
        System.out.println("Train          : " + train.getTrainName());
        System.out.println("Seat Number    : " + seatNo);
        System.out.println("==============================");

    }

}