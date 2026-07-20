package railway.datastructures;

import railway.model.Reservation;

public class AVLTree {

    private static class TreeNode {
        Reservation reservation;
        TreeNode left;
        TreeNode right;
        int height;

        // Create an AVL tree node with reservation data.
        TreeNode(Reservation reservation) {
            this.reservation = reservation;
            this.height = 1;
        }
    }

    private TreeNode root;

    // Insert a reservation into the AVL tree.
    public void insert(Reservation reservation) {
        root = insert(root, reservation);
    }

    // Recursively insert and rebalance the AVL tree.
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
            return node;
        }

        updateHeight(node);
        return balance(node);

    }

    // Delete a reservation from the AVL tree by reservation ID.
    public void delete(int reservationId) {
        root = delete(root, reservationId);
    }

    // Recursively delete and rebalance the AVL tree.
    private TreeNode delete(TreeNode node, int reservationId) {

        if (node == null) {
            return null;
        }

        if (reservationId < node.reservation.getReservationId()) {
            node.left = delete(node.left, reservationId);
        } else if (reservationId > node.reservation.getReservationId()) {
            node.right = delete(node.right, reservationId);
        } else {
            if (node.left == null || node.right == null) {
                node = (node.left != null) ? node.left : node.right;
            } else {
                TreeNode successor = min(node.right);
                node.reservation = successor.reservation;
                node.right = delete(node.right, successor.reservation.getReservationId());
            }
        }

        if (node == null) {
            return null;
        }

        updateHeight(node);
        return balance(node);

    }

    // Find the smallest node in a subtree.
    private TreeNode min(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    // Search the AVL tree using reservation ID.
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

    // Return the height of a node.
    private int height(TreeNode node) {
        return node == null ? 0 : node.height;
    }

    // Recalculate the height of a node.
    private void updateHeight(TreeNode node) {
        node.height = 1 + Math.max(height(node.left), height(node.right));
    }

    // Calculate the balance factor of a node.
    private int balanceFactor(TreeNode node) {
        return node == null ? 0 : height(node.left) - height(node.right);
    }

    // Balance an AVL node using rotations when needed.
    private TreeNode balance(TreeNode node) {

        int balance = balanceFactor(node);

        if (balance > 1) {
            if (balanceFactor(node.left) < 0) {
                node.left = rotateLeft(node.left);
            }
            return rotateRight(node);
        }

        if (balance < -1) {
            if (balanceFactor(node.right) > 0) {
                node.right = rotateRight(node.right);
            }
            return rotateLeft(node);
        }
        return node;

    }

    // Perform a right rotation.
    private TreeNode rotateRight(TreeNode y) {

        TreeNode x = y.left;
        TreeNode t2 = x.right;
        x.right = y;
        y.left = t2;
        updateHeight(y);
        updateHeight(x);
        return x;
    }

    // Perform a left rotation.
    private TreeNode rotateLeft(TreeNode x) {
        TreeNode y = x.right;
        TreeNode t2 = y.left;
        y.left = x;
        x.right = t2;
        updateHeight(x);
        updateHeight(y);
        return y;
    }

}
