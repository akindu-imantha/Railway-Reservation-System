package railway.datastructures;

import java.util.ArrayList;
import java.util.LinkedList;

public class Graph {

    private String[] stations;
    private int[][] adjacencyMatrix;

    // Create an empty graph.
    public Graph() {
        stations = new String[0];
        adjacencyMatrix = new int[0][0];
    }

    // Create a graph with a fixed station list.
    public Graph(String[] stations) {
        this.stations = stations;
        adjacencyMatrix = new int[stations.length][stations.length];
    }

    // Add an undirected weighted edge between two stations.
    public void addEdge(String source, String destination, int distance) {

        int sourceIndex = indexOf(source);
        int destinationIndex = indexOf(destination);

        if (sourceIndex == -1 || destinationIndex == -1 || distance <= 0) {
            return;
        }

        adjacencyMatrix[sourceIndex][destinationIndex] = distance;
        adjacencyMatrix[destinationIndex][sourceIndex] = distance;

    }

    // Traverse stations using breadth-first search.
    public void bfs(String start) {

        int startIndex = indexOf(start);

        if (startIndex == -1) {
            System.out.println("Station Not Found.");
            return;
        }

        boolean[] visited = new boolean[stations.length];
        LinkedList<Integer> queue = new LinkedList<>();

        visited[startIndex] = true;
        queue.add(startIndex);

        System.out.print("BFS Route Order : ");

        while (!queue.isEmpty()) {
            int current = queue.removeFirst();
            System.out.print(stations[current] + " ");

            for (int i = 0; i < stations.length; i++) {
                if (adjacencyMatrix[current][i] > 0 && !visited[i]) {
                    visited[i] = true;
                    queue.add(i);
                }
            }
        }

        System.out.println();

    }

    // Traverse stations using depth-first search.
    public void dfs(String start) {

        int startIndex = indexOf(start);

        if (startIndex == -1) {
            System.out.println("Station Not Found.");
            return;
        }

        boolean[] visited = new boolean[stations.length];
        System.out.print("DFS Route Order : ");
        dfs(startIndex, visited);
        System.out.println();

    }

    // Recursively visit connected stations for DFS.
    private void dfs(int current, boolean[] visited) {

        visited[current] = true;
        System.out.print(stations[current] + " ");

        for (int i = 0; i < stations.length; i++) {
            if (adjacencyMatrix[current][i] > 0 && !visited[i]) {
                dfs(i, visited);
            }
        }

    }

    // Display all direct railway routes.
    public void displayRoutes() {

        System.out.println("\n========== Railway Routes ==========");

        for (int i = 0; i < stations.length; i++) {
            for (int j = i + 1; j < stations.length; j++) {
                if (adjacencyMatrix[i][j] > 0) {
                    System.out.println(stations[i] + " -> " + stations[j]
                            + " : " + adjacencyMatrix[i][j] + " km");
                }
            }
        }

    }

    // Find and display the shortest path between two stations.
    public void shortestPath(String source, String destination) {

        int sourceIndex = indexOf(source);
        int destinationIndex = indexOf(destination);

        if (sourceIndex == -1 || destinationIndex == -1) {
            System.out.println("Station Not Found.");
            return;
        }

        int[] distance = new int[stations.length];
        boolean[] visited = new boolean[stations.length];
        int[] previous = new int[stations.length];

        for (int i = 0; i < stations.length; i++) {
            distance[i] = Integer.MAX_VALUE;
            previous[i] = -1;
        }

        distance[sourceIndex] = 0;

        for (int count = 0; count < stations.length - 1; count++) {
            int current = minDistance(distance, visited);

            if (current == -1) {
                break;
            }

            visited[current] = true;

            for (int i = 0; i < stations.length; i++) {
                if (!visited[i] && adjacencyMatrix[current][i] > 0
                        && distance[current] != Integer.MAX_VALUE
                        && distance[current] + adjacencyMatrix[current][i] < distance[i]) {
                    distance[i] = distance[current] + adjacencyMatrix[current][i];
                    previous[i] = current;
                }
            }
        }

        if (distance[destinationIndex] == Integer.MAX_VALUE) {
            System.out.println("No Route Found.");
            return;
        }

        ArrayList<String> path = new ArrayList<>();
        int current = destinationIndex;

        while (current != -1) {
            path.add(0, stations[current]);
            current = previous[current];
        }

        System.out.println("Shortest Path : " + String.join(" -> ", path));
        System.out.println("Distance      : " + distance[destinationIndex] + " km");

    }

    // Find the unvisited station with the smallest distance.
    private int minDistance(int[] distance, boolean[] visited) {

        int min = Integer.MAX_VALUE;
        int minIndex = -1;

        for (int i = 0; i < distance.length; i++) {
            if (!visited[i] && distance[i] <= min) {
                min = distance[i];
                minIndex = i;
            }
        }

        return minIndex;

    }

    // Return the index of a station name.
    private int indexOf(String station) {

        for (int i = 0; i < stations.length; i++) {
            if (stations[i].equalsIgnoreCase(station)) {
                return i;
            }
        }

        return -1;

    }

}
