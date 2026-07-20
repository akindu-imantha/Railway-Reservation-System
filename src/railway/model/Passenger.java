package railway.model;

public class Passenger {

    private int passengerId;
    private String name;
    private String nic;
    private String phone;

    public Passenger(int passengerId, String name,
                     String nic, String phone) {

        this.passengerId = passengerId;
        this.name = name;
        this.nic = nic;
        this.phone = phone;
    }

    public int getPassengerId() {
        return passengerId;
    }

    public String getName() {
        return name;
    }

    public String getNic() {
        return nic;
    }

    public String getPhone() {
        return phone;
    }

    public void displayPassenger() {

        System.out.println("-----------------------------");
        System.out.println("Passenger ID : " + passengerId);
        System.out.println("Name         : " + name);
        System.out.println("NIC          : " + nic);
        System.out.println("Phone        : " + phone);
        System.out.println("-----------------------------");

    }

}