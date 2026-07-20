package railway.model;

public class Passenger {

    private int passengerId;
    private String name;
    private String nic;
    private String phone;

    // Create a passenger with personal details.
    public Passenger(int passengerId, String name,
                     String nic, String phone) {

        this.passengerId = passengerId;
        this.name = name;
        this.nic = nic;
        this.phone = phone;
    }

    // Return the passenger ID.
    public int getPassengerId() {
        return passengerId;
    }

    // Return the passenger name.
    public String getName() {
        return name;
    }

    // Return the passenger NIC.
    public String getNic() {
        return nic;
    }

    // Return the passenger phone number.
    public String getPhone() {
        return phone;
    }

    // Print passenger details to the console.
    public void displayPassenger() {

        System.out.println("-----------------------------");
        System.out.println("Passenger ID : " + passengerId);
        System.out.println("Name         : " + name);
        System.out.println("NIC          : " + nic);
        System.out.println("Phone        : " + phone);
        System.out.println("-----------------------------");

    }

}
