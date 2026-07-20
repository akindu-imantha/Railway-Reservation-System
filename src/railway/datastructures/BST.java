package railway.datastructures;

import railway.model.Reservation;

public class BST {

    private static class TreeNode {
        Reservation reservation;
        TreeNode left;
        TreeNode right;

        // Create a BST node with reservation data.
        TreeNode(Reservation reservation) {
            this.reservation = reservation;
        }
    }

    private TreeNode root;

    // Insert a reservation into the BST.
    public void insert(Reservation reservation) {
        root = insert(root, reservation);
    }

    // Recursively place a reservation in the correct BST position.
    private TreeNode insert(TreeNode node, Reservation reservation) {

        if (node == null) {
            return new TreeNode(reservation);
        }

        if (reservation.getReservationId() < node.reservation.getReservationId()) {
            node.left = insert(node.left, reservation);
        } else if (reservation.getReservationId() > node.reservation.getReservationId()) {
            node.right = insert(node.right, reservation);
        } else {
            node.reservation = reservation;
        }

        return node;

    }

    // Delete a reservation from the BST by reservation ID.
    public void delete(int reservationId) {
        root = delete(root, reservationId);
    }

    // Recursively remove a node from the BST.
    private TreeNode delete(TreeNode node, int reservationId) {

        if (node == null) {
            return null;
        }

        if (reservationId < node.reservation.getReservationId()) {
            node.left = delete(node.left, reservationId);
        } else if (reservationId > node.reservation.getReservationId()) {
            node.right = delete(node.right, reservationId);
        } else {
            if (node.left == null) {
                return node.right;
            }

            if (node.right == null) {
                return node.left;
            }

            TreeNode successor = min(node.right);
            node.reservation = successor.reservation;
            node.right = delete(node.right, successor.reservation.getReservationId());
        }

        return node;

    }

    // Find the smallest node in a subtree.
    private TreeNode min(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    // Search the BST using reservation ID.
    public Reservation search(int reservationId) {

        TreeNode current = root;

        while (current != null) {
            if (reservationId == current.reservation.getReservationId()) {
                return current.reservation;
            }

            if (reservationId < current.reservation.getReservationId()) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        return null;

    }

    // Display reservations in sorted order by reservation ID.
    public void inorder() {
        inorder(root);
    }

    // Recursively traverse the BST in inorder sequence.
    private void inorder(TreeNode node) {

        if (node == null) {
            return;
        }

        inorder(node.left);
        node.reservation.displayReservation();
        inorder(node.right);

    }

}
