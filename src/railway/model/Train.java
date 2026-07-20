package railway.model;

public class Train {

    private int trainNo;
    private String trainName;
    private String source;
    private String destination;
    private int totalSeats;
    private int availableSeats;

    public Train(int trainNo, String trainName, String source,
                 String destination, int totalSeats) {

        this.trainNo = trainNo;
        this.trainName = trainName;
        this.source = source;
        this.destination = destination;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
    }

    public int getTrainNo() {
        return trainNo;
    }

    public String getTrainName() {
        return trainName;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void bookSeat() {
        if (availableSeats > 0)
            availableSeats--;
    }

    public void cancelSeat() {
        if (availableSeats < totalSeats)
            availableSeats++;
    }

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