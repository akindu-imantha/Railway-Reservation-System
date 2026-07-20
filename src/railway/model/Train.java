package railway.model;

public class Train {

    private int trainNo;
    private String trainName;
    private String source;
    private String destination;
    private int totalSeats;
    private int availableSeats;

    // Create a train with route details and initial seat count.
    public Train(int trainNo, String trainName, String source,
                 String destination, int totalSeats) {

        this.trainNo = trainNo;
        this.trainName = trainName;
        this.source = source;
        this.destination = destination;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
    }

    // Return the train number.
    public int getTrainNo() {
        return trainNo;
    }

    // Return the train name.
    public String getTrainName() {
        return trainName;
    }

    // Return the starting station.
    public String getSource() {
        return source;
    }

    // Return the destination station.
    public String getDestination() {
        return destination;
    }

    // Return the total number of seats.
    public int getTotalSeats() {
        return totalSeats;
    }

    // Return the current available seat count.
    public int getAvailableSeats() {
        return availableSeats;
    }

    // Reduce available seats when a ticket is booked.
    public void bookSeat() {
        if (availableSeats > 0)
            availableSeats--;
    }

    // Increase available seats when a ticket is cancelled.
    public void cancelSeat() {
        if (availableSeats < totalSeats)
            availableSeats++;
    }

    // Print train details to the console.
    public void displayTrain() {

        System.out.println("---------------------------------------");
        System.out.println("Train No      : " + trainNo);
        System.out.println("Train Name    : " + trainName);
        System.out.println("Route         : " + source + " -> " + destination);
        System.out.println("Total Seats   : " + totalSeats);
        System.out.println("Available     : " + availableSeats);
        System.out.println("---------------------------------------");
    }

}
