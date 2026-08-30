/* ============================================
   Run Operation Panel — Step-by-Step Executor
   ============================================ */

// ===== OPERATION DEFINITIONS =====

const runOperationDefs = {
    linkedList: {
        insert: {
            label: 'Insert Reservation',
            fields: [
                { id: 'runName', label: 'Passenger Name', type: 'text', placeholder: 'e.g. Kamal' },
                { id: 'runNic', label: 'NIC', type: 'text', placeholder: 'e.g. 990101010V' },
                { id: 'runPhone', label: 'Phone', type: 'text', placeholder: 'e.g. 0771234567' },
                { id: 'runSeat', label: 'Seat No', type: 'number', placeholder: 'e.g. 5' }
            ],
            code: [
                '// LinkedList - Insert at end',
                'public void insert(Reservation r) {',
                '  Node newNode = new Node(r);',
                '  if (head == null) {',
                '    head = newNode;',
                '    size++; return;',
                '  }',
                '  Node current = head;',
                '  while (current.next != null)',
                '    current = current.next;',
                '  current.next = newNode;',
                '  size++;',
                '}'
            ],
            run: function () {
                var name = document.getElementById('runName').value.trim() || 'Passenger';
                var nic = document.getElementById('runNic').value.trim() || '000000000V';
                var phone = document.getElementById('runPhone').value.trim() || '0770000000';
                var seatNo = parseInt(document.getElementById('runSeat').value) || 1;
                var train = trains[0];
                var steps = [];

                steps.push({ line: 0, type: 'highlight', text: '🔗 Starting LinkedList.insert()' });
                steps.push({ line: 2, type: 'traverse', text: 'Creating <strong>newNode</strong> with Reservation #' + nextReservationId });
                steps.push({ line: 3, type: 'compare', text: 'Checking: <strong>head == null</strong>? → ' + (reservations.length === 0 ? 'YES' : 'NO') });

                if (reservations.length === 0) {
                    steps.push({ line: 4, type: 'highlight', text: 'head is null — setting <strong>head = newNode</strong>' });
                    steps.push({ line: 5, type: 'success', text: 'Incrementing size. Node is now HEAD.' });
                } else {
                    steps.push({ line: 7, type: 'traverse', text: 'Setting <strong>current = head</strong> (#' + reservations[0].reservationId + ')' });
                    var i = 0;
                    while (i < reservations.length - 1) {
                        steps.push({ line: 8, type: 'compare', text: 'current.next != null? → YES, moving to #' + reservations[i + 1].reservationId });
                        steps.push({ line: 9, type: 'traverse', text: 'current = current.next → #' + reservations[i + 1].reservationId });
                        i++;
                    }
                    steps.push({ line: 8, type: 'compare', text: 'current.next != null? → NO, reached end (tail)' });
                    steps.push({ line: 10, type: 'highlight', text: 'Setting <strong>tail.next = newNode</strong>' });
                    steps.push({ line: 11, type: 'success', text: 'Incrementing size. Total nodes: ' + (reservations.length + 1) });
                }

                // Actually perform the insert
                var reservation = { reservationId: nextReservationId++, passenger: { passengerId: nextPassengerId++, name: name, nic: nic, phone: phone }, train: train, seatNo: seatNo };
                passengersMap[reservation.passenger.passengerId] = reservation.passenger;
                reservations.push(reservation);
                train.availableSeats--;

                steps.push({ line: 12, type: 'success', text: '✅ Insert complete! Reservation #' + reservation.reservationId + ' added. (' + reservations.length + ' total nodes)' });

                return { steps: steps, resultId: reservation.reservationId };
            }
        },
        delete: {
            label: 'Delete Reservation',
            fields: [
                { id: 'runDeleteId', label: 'Reservation ID to Delete', type: 'number', placeholder: 'e.g. 1001' }
            ],
            code: [
                '// LinkedList - Delete by ID',
                'public boolean delete(int id) {',
                '  if (head == null) return false;',
                '  if (head.data.id == id) {',
                '    head = head.next;',
                '    size--; return true;',
                '  }',
                '  Node current = head;',
                '  while (current.next != null) {',
                '    if (current.next.data.id == id) {',
                '      current.next = current.next.next;',
                '      size--; return true;',
                '    }',
                '    current = current.next;',
                '  }',
                '  return false;',
                '}'
            ],
            run: function () {
                var id = parseInt(document.getElementById('runDeleteId').value);
                var steps = [];
                steps.push({ line: 0, type: 'highlight', text: '🔗 Starting LinkedList.delete(' + id + ')' });
                steps.push({ line: 2, type: 'compare', text: 'Checking: <strong>head == null</strong>? → ' + (reservations.length === 0 ? 'YES — empty list!' : 'NO') });

                if (reservations.length === 0) {
                    steps.push({ line: 2, type: 'traverse', text: 'List is empty, returning <strong>false</strong>' });
                    return { steps: steps, failed: true };
                }

                steps.push({ line: 3, type: 'compare', text: 'head.data.id == ' + id + '? → ' + (reservations[0].reservationId === id ? 'YES!' : 'NO') });

                if (reservations[0].reservationId === id) {
                    steps.push({ line: 4, type: 'highlight', text: 'Removing head! Setting <strong>head = head.next</strong>' });
                    var removed = reservations.shift();
                    steps.push({ line: 5, type: 'success', text: '✅ Deleted head node #' + id + '. Size: ' + reservations.length });
                    return { steps: steps, resultId: id };
                }

                steps.push({ line: 7, type: 'traverse', text: 'Setting <strong>current = head</strong> (#' + reservations[0].reservationId + ')' });
                var found = false;
                for (var i = 0; i < reservations.length - 1; i++) {
                    steps.push({ line: 8, type: 'compare', text: 'current.next != null? → YES' });
                    steps.push({ line: 9, type: 'compare', text: 'current.next.data.id == ' + id + '? → ' + (reservations[i + 1].reservationId === id ? 'YES!' : 'NO (' + reservations[i + 1].reservationId + ')') });
                    if (reservations[i + 1].reservationId === id) {
                        steps.push({ line: 10, type: 'highlight', text: 'Bypassing node! <strong>current.next = current.next.next</strong>' });
                        reservations.splice(i + 1, 1);
                        found = true;
                        steps.push({ line: 11, type: 'success', text: '✅ Deleted #' + id + '. Size: ' + reservations.length });
                        break;
                    }
                    steps.push({ line: 13, type: 'traverse', text: 'current = current.next → #' + reservations[i + 1].reservationId });
                }

                if (!found) {
                    steps.push({ line: 8, type: 'compare', text: 'current.next != null? → NO (end of list)' });
                    steps.push({ line: 15, type: 'traverse', text: '❌ Not found! Returning <strong>false</strong>' });
                    return { steps: steps, failed: true };
                }

                return { steps: steps, resultId: id };
            }
        },
        search: {
            label: 'Search by NIC',
            fields: [
                { id: 'runSearchNic', label: 'NIC to Search', type: 'text', placeholder: 'e.g. 990101010V' }
            ],
            code: [
                '// LinkedList - Search by NIC',
                'public Reservation searchByNic(String nic) {',
                '  Node current = head;',
                '  while (current != null) {',
                '    if (current.data.passenger.nic',
                '        .equals(nic))',
                '      return current.data;',
                '    current = current.next;',
                '  }',
                '  return null;',
                '}'
            ],
            run: function () {
                var nic = document.getElementById('runSearchNic').value.trim();
                var steps = [];
                steps.push({ line: 0, type: 'highlight', text: '🔗 Starting LinkedList.searchByNic("' + nic + '")' });
                steps.push({ line: 2, type: 'traverse', text: 'Setting <strong>current = head</strong>' });

                var found = null;
                for (var i = 0; i < reservations.length; i++) {
                    steps.push({ line: 3, type: 'compare', text: 'current != null? → YES (at #' + reservations[i].reservationId + ')' });
                    var match = reservations[i].passenger.nic.toLowerCase() === nic.toLowerCase();
                    steps.push({ line: 4, type: 'compare', text: 'nic == "' + reservations[i].passenger.nic + '"? → ' + (match ? 'YES! ✅' : 'NO') });
                    if (match) {
                        steps.push({ line: 6, type: 'success', text: '✅ Found! Returning reservation #' + reservations[i].reservationId });
                        found = reservations[i];
                        break;
                    }
                    steps.push({ line: 7, type: 'traverse', text: 'current = current.next' });
                }

                if (!found) {
                    steps.push({ line: 3, type: 'compare', text: 'current != null? → NO (end of list)' });
                    steps.push({ line: 9, type: 'traverse', text: '❌ Not found! Returning <strong>null</strong>' });
                }

                return { steps: steps, foundReservation: found };
            }
        }
    },
    queue: {
        enqueue: {
            label: 'Enqueue Passenger',
            fields: [
                { id: 'runEnqName', label: 'Passenger Name', type: 'text', placeholder: 'e.g. Nimal' },
                { id: 'runEnqNic', label: 'NIC', type: 'text', placeholder: 'e.g. 990101010V' },
                { id: 'runEnqPhone', label: 'Phone', type: 'text', placeholder: 'e.g. 0771234567' }
            ],
            code: [
                '// Queue - Enqueue (add to rear)',
                'public void enqueue(Passenger p) {',
                '  QueueNode newNode = new QueueNode(p);',
                '  if (rear == null) {',
                '    front = rear = newNode;',
                '    return;',
                '  }',
                '  rear.next = newNode;',
                '  rear = newNode;',
                '}'
            ],
            run: function () {
                var name = document.getElementById('runEnqName').value.trim() || 'Passenger';
                var nic = document.getElementById('runEnqNic').value.trim() || '000000000V';
                var phone = document.getElementById('runEnqPhone').value.trim() || '0770000000';
                var steps = [];
                var wasEmpty = waitingQueue.length === 0;

                steps.push({ line: 0, type: 'highlight', text: '📦 Starting Queue.enqueue()' });
                steps.push({ line: 2, type: 'traverse', text: 'Creating <strong>newNode</strong> with passenger "' + name + '"' });
                steps.push({ line: 3, type: 'compare', text: 'rear == null? → ' + (wasEmpty ? 'YES (empty queue!)' : 'NO') });

                if (wasEmpty) {
                    steps.push({ line: 4, type: 'highlight', text: 'Queue empty — setting <strong>front = rear = newNode</strong>' });
                } else {
                    steps.push({ line: 7, type: 'highlight', text: 'rear.next = newNode (linking)' });
                    steps.push({ line: 8, type: 'highlight', text: '<strong>rear = newNode</strong> (update rear pointer)' });
                }

                var passenger = { passengerId: nextPassengerId++, name: name, nic: nic, phone: phone };
                passengersMap[passenger.passengerId] = passenger;
                waitingQueue.push(passenger);

                steps.push({ line: 9, type: 'success', text: '✅ Enqueued "' + name + '" at rear. Queue size: ' + waitingQueue.length });
                return { steps: steps };
            }
        },
        dequeue: {
            label: 'Dequeue Passenger',
            fields: [],
            code: [
                '// Queue - Dequeue (remove from front)',
                'public Passenger dequeue() {',
                '  if (isEmpty())',
                '    return null;',
                '  Passenger p = front.data;',
                '  front = front.next;',
                '  if (front == null)',
                '    rear = null;',
                '  return p;',
                '}'
            ],
            run: function () {
                var steps = [];
                steps.push({ line: 0, type: 'highlight', text: '📦 Starting Queue.dequeue()' });
                steps.push({ line: 2, type: 'compare', text: 'isEmpty()? → ' + (waitingQueue.length === 0 ? 'YES!' : 'NO (' + waitingQueue.length + ' items)') });

                if (waitingQueue.length === 0) {
                    steps.push({ line: 3, type: 'traverse', text: 'Queue is empty, returning <strong>null</strong>' });
                    return { steps: steps, failed: true };
                }

                var dequeued = waitingQueue[0];
                steps.push({ line: 4, type: 'traverse', text: 'front.data = <strong>"' + dequeued.name + '"</strong>' });
                steps.push({ line: 5, type: 'highlight', text: 'front = front.next' });

                waitingQueue.shift();

                if (waitingQueue.length === 0) {
                    steps.push({ line: 6, type: 'compare', text: 'front == null? → YES' });
                    steps.push({ line: 7, type: 'highlight', text: 'Setting <strong>rear = null</strong> (queue now empty)' });
                }

                steps.push({ line: 8, type: 'success', text: '✅ Dequeued "' + dequeued.name + '" from front. Queue size: ' + waitingQueue.length });
                return { steps: steps, dequeuedPassenger: dequeued };
            }
        }
    },
    stack: {
        push: {
            label: 'Push to Stack',
            fields: [
                { id: 'runPushName', label: 'Passenger Name', type: 'text', placeholder: 'e.g. Kamal' },
                { id: 'runPushTrain', label: 'Train Name', type: 'text', placeholder: 'e.g. Yal Devi' },
                { id: 'runPushSeat', label: 'Seat No', type: 'number', placeholder: 'e.g. 5' }
            ],
            code: [
                '// Stack - Push',
                'public void push(Reservation r) {',
                '  Node newNode = new Node(r);',
                '  newNode.next = top;',
                '  top = newNode;',
                '}'
            ],
            run: function () {
                var name = document.getElementById('runPushName').value.trim() || 'Passenger';
                var trainName = document.getElementById('runPushTrain').value.trim() || 'Yal Devi';
                var seatNo = parseInt(document.getElementById('runPushSeat').value) || 1;
                var steps = [];

                steps.push({ line: 0, type: 'highlight', text: '📚 Starting Stack.push()' });
                steps.push({ line: 2, type: 'traverse', text: 'Creating <strong>newNode</strong> with Reservation #' + nextReservationId });
                steps.push({ line: 3, type: 'highlight', text: 'newNode.next = top → ' + (undoStack.length === 0 ? 'null (empty stack)' : '#' + undoStack[undoStack.length - 1].reservationId) });
                steps.push({ line: 4, type: 'highlight', text: '<strong>top = newNode</strong> (new node is now top)' });

                var reservation = { reservationId: nextReservationId++, passenger: { passengerId: nextPassengerId++, name: name, nic: '000', phone: '000' }, train: { trainName: trainName }, seatNo: seatNo };
                undoStack.push(reservation);

                steps.push({ line: 5, type: 'success', text: '✅ Pushed #' + reservation.reservationId + ' to top. Stack size: ' + undoStack.length });
                return { steps: steps };
            }
        },
        pop: {
            label: 'Pop from Stack',
            fields: [],
            code: [
                '// Stack - Pop',
                'public Reservation pop() {',
                '  if (isEmpty())',
                '    return null;',
                '  Reservation r = top.data;',
                '  top = top.next;',
                '  return r;',
                '}'
            ],
            run: function () {
                var steps = [];
                steps.push({ line: 0, type: 'highlight', text: '📚 Starting Stack.pop()' });
                steps.push({ line: 2, type: 'compare', text: 'isEmpty()? → ' + (undoStack.length === 0 ? 'YES!' : 'NO (' + undoStack.length + ' items)') });

                if (undoStack.length === 0) {
                    steps.push({ line: 3, type: 'traverse', text: 'Stack is empty, returning <strong>null</strong>' });
                    return { steps: steps, failed: true };
                }

                var popped = undoStack[undoStack.length - 1];
                steps.push({ line: 4, type: 'traverse', text: 'top.data = <strong>#' + popped.reservationId + '</strong> ("' + popped.passenger.name + '")' });
                steps.push({ line: 5, type: 'highlight', text: 'top = top.next' });

                undoStack.pop();

                steps.push({ line: 6, type: 'success', text: '✅ Popped #' + popped.reservationId + '. Stack size: ' + undoStack.length });
                return { steps: steps, poppedReservation: popped };
            }
        }
    },
    bst: {
        insert: {
            label: 'Insert into BST',
            fields: [
                { id: 'runBstId', label: 'Reservation ID', type: 'number', placeholder: 'e.g. 1005' },
                { id: 'runBstName', label: 'Passenger Name', type: 'text', placeholder: 'e.g. Sunil' }
            ],
            code: [
                '// BST - Insert',
                'private TreeNode insert(TreeNode node, Reservation r) {',
                '  if (node == null)',
                '    return new TreeNode(r);',
                '  if (r.id < node.reservation.id)',
                '    node.left = insert(node.left, r);',
                '  else if (r.id > node.reservation.id)',
                '    node.right = insert(node.right, r);',
                '  return node;',
                '}'
            ],
            run: function () {
                var insertId = parseInt(document.getElementById('runBstId').value) || (nextReservationId + 100);
                var name = document.getElementById('runBstName').value.trim() || 'Passenger';
                var steps = [];
                var sorted = reservations.slice().sort(function (a, b) { return a.reservationId - b.reservationId; });

                steps.push({ line: 0, type: 'highlight', text: '🌳 Starting BST.insert(#' + insertId + ')' });

                if (sorted.length === 0) {
                    steps.push({ line: 2, type: 'compare', text: 'root == null? → YES' });
                    steps.push({ line: 3, type: 'success', text: 'Creating root node with #' + insertId });
                } else {
                    // Walk the tree
                    var current = sorted[0];
                    steps.push({ line: 0, type: 'traverse', text: 'Starting at root #' + current.reservationId });

                    // Simulate BST traversal
                    var path = [current];
                    for (var d = 0; d < 5; d++) {
                        var resId = current.reservationId;
                        if (insertId < resId) {
                            steps.push({ line: 4, type: 'compare', text: insertId + ' < ' + resId + '? → YES → go LEFT' });
                            var leftChild = sorted.find(function (r) { return r.reservationId < resId && (path.indexOf(r) === -1); });
                            if (leftChild) {
                                steps.push({ line: 5, type: 'traverse', text: 'Visiting left child #' + leftChild.reservationId });
                                current = leftChild;
                                path.push(current);
                            } else {
                                steps.push({ line: 3, type: 'highlight', text: 'No left child — inserting here as leaf!' });
                                break;
                            }
                        } else if (insertId > resId) {
                            steps.push({ line: 6, type: 'compare', text: insertId + ' > ' + resId + '? → YES → go RIGHT' });
                            var rightChild = sorted.find(function (r) { return r.reservationId > resId && (path.indexOf(r) === -1); });
                            if (rightChild) {
                                steps.push({ line: 7, type: 'traverse', text: 'Visiting right child #' + rightChild.reservationId });
                                current = rightChild;
                                path.push(current);
                            } else {
                                steps.push({ line: 3, type: 'highlight', text: 'No right child — inserting here as leaf!' });
                                break;
                            }
                        } else {
                            steps.push({ line: 4, type: 'compare', text: insertId + ' == ' + resId + '? → Duplicate! Updating.' });
                            break;
                        }
                    }
                }

                var train = trains[0];
                var reservation = { reservationId: insertId, passenger: { passengerId: nextPassengerId++, name: name, nic: '000', phone: '000' }, train: train, seatNo: 1 };
                passengersMap[reservation.passenger.passengerId] = reservation.passenger;
                reservations.push(reservation);
                train.availableSeats--;

                steps.push({ line: 8, type: 'success', text: '✅ Inserted #' + insertId + ' into BST. Total nodes: ' + reservations.length });
                return { steps: steps, resultId: insertId };
            }
        },
        search: {
            label: 'Search BST by ID',
            fields: [
                { id: 'runBstSearchId', label: 'Reservation ID', type: 'number', placeholder: 'e.g. 1001' }
            ],
            code: [
                '// BST - Search by ID',
                'public Reservation search(int id) {',
                '  TreeNode current = root;',
                '  while (current != null) {',
                '    if (id == current.reservation.id)',
                '      return current.data;',
                '    if (id < current.reservation.id)',
                '      current = current.left;',
                '    else',
                '      current = current.right;',
                '  }',
                '  return null;',
                '}'
            ],
            run: function () {
                var searchId = parseInt(document.getElementById('runBstSearchId').value);
                var steps = [];
                var sorted = reservations.slice().sort(function (a, b) { return a.reservationId - b.reservationId; });

                steps.push({ line: 0, type: 'highlight', text: '🌳 Starting BST.search(#' + searchId + ')' });

                if (sorted.length === 0) {
                    steps.push({ line: 2, type: 'compare', text: 'Tree is empty → returning null' });
                    return { steps: steps, failed: true };
                }

                steps.push({ line: 2, type: 'traverse', text: 'current = root #' + sorted[0].reservationId });
                var current = sorted[0];
                var found = false;
                for (var d = 0; d < 10; d++) {
                    steps.push({ line: 3, type: 'compare', text: 'current != null? → YES' });
                    if (searchId === current.reservationId) {
                        steps.push({ line: 4, type: 'compare', text: searchId + ' == ' + current.reservationId + '? → YES! ✅' });
                        steps.push({ line: 5, type: 'success', text: '✅ Found reservation #' + searchId + '!' });
                        found = true;
                        break;
                    } else if (searchId < current.reservationId) {
                        steps.push({ line: 6, type: 'compare', text: searchId + ' < ' + current.reservationId + '? → YES → go LEFT' });
                        var left = sorted.find(function (r) { return r.reservationId < current.reservationId; });
                        if (left) {
                            steps.push({ line: 7, type: 'traverse', text: 'current = left child #' + left.reservationId });
                            current = left;
                        } else {
                            steps.push({ line: 7, type: 'traverse', text: 'left is null → not found!' });
                            break;
                        }
                    } else {
                        steps.push({ line: 6, type: 'compare', text: searchId + ' > ' + current.reservationId + '? → YES → go RIGHT' });
                        var right = sorted.find(function (r) { return r.reservationId > current.reservationId; });
                        if (right) {
                            steps.push({ line: 9, type: 'traverse', text: 'current = right child #' + right.reservationId });
                            current = right;
                        } else {
                            steps.push({ line: 9, type: 'traverse', text: 'right is null → not found!' });
                            break;
                        }
                    }
                }

                if (!found) {
                    steps.push({ line: 3, type: 'compare', text: 'current == null → end of tree' });
                    steps.push({ line: 11, type: 'traverse', text: '❌ Returning <strong>null</strong> — #' + searchId + ' not in BST' });
                }

                return { steps: steps };
            }
        }
    },
    hashTable: {
        insert: {
            label: 'Insert Passenger',
            fields: [
                { id: 'runHtName', label: 'Passenger Name', type: 'text', placeholder: 'e.g. Kamal' },
                { id: 'runHtNic', label: 'NIC', type: 'text', placeholder: 'e.g. 990101010V' },
                { id: 'runHtPhone', label: 'Phone', type: 'text', placeholder: 'e.g. 0771234567' }
            ],
            code: [
                '// HashTable - Insert passenger',
                'public void insert(Passenger p) {',
                '  int index = hash(p.passengerId);',
                '  Entry current = table[index];',
                '  while (current != null) {',
                '    if (current.passenger.id == p.id)',
                '      { current.passenger = p; return; }',
                '    current = current.next;',
                '  }',
                '  Entry entry = new Entry(p);',
                '  entry.next = table[index];',
                '  table[index] = entry;',
                '}'
            ],
            run: function () {
                var name = document.getElementById('runHtName').value.trim() || 'Passenger';
                var nic = document.getElementById('runHtNic').value.trim() || '000000000V';
                var phone = document.getElementById('runHtPhone').value.trim() || '0770000000';
                var steps = [];
                var pid = nextPassengerId;
                var capacity = 7;
                var index = pid % capacity;

                steps.push({ line: 0, type: 'highlight', text: '🗂️ Starting HashTable.insert() for new passenger' });
                steps.push({ line: 2, type: 'highlight', text: 'hash(' + pid + ') = ' + pid + ' % ' + capacity + ' = <strong>' + index + '</strong>' });
                steps.push({ line: 3, type: 'traverse', text: 'Accessing table[' + index + ']' });

                var bucket = Object.values(passengersMap).filter(function (p) { return p.passengerId % capacity === index; });

                steps.push({ line: 4, type: 'compare', text: 'Chaining through bucket... (' + bucket.length + ' existing entries)' });

                if (bucket.length === 0) {
                    steps.push({ line: 4, type: 'compare', text: 'current == null? → YES (empty bucket)' });
                } else {
                    steps.push({ line: 5, type: 'compare', text: 'Checking existing entries for duplicate ID...' });
                    steps.push({ line: 7, type: 'compare', text: 'current = current.next → null (end of chain)' });
                }

                steps.push({ line: 9, type: 'highlight', text: 'Creating new <strong>Entry</strong>' });
                steps.push({ line: 10, type: 'highlight', text: 'entry.next = table[' + index + '] (prepend to chain)' });
                steps.push({ line: 11, type: 'highlight', text: 'table[' + index + '] = entry' });

                var passenger = { passengerId: nextPassengerId++, name: name, nic: nic, phone: phone };
                passengersMap[passenger.passengerId] = passenger;

                steps.push({ line: 12, type: 'success', text: '✅ Inserted "' + name + '" at index ' + index + ' (key: #' + passenger.passengerId + '). Total: ' + Object.keys(passengersMap).length + ' entries' });
                return { steps: steps };
            }
        },
        search: {
            label: 'Search by Passenger ID',
            fields: [
                { id: 'runHtSearchId', label: 'Passenger ID', type: 'number', placeholder: 'e.g. 1' }
            ],
            code: [
                '// HashTable - Search by ID',
                'public Passenger search(int id) {',
                '  int index = hash(id);',
                '  Entry current = table[index];',
                '  while (current != null) {',
                '    if (current.passenger.id == id)',
                '      return current.passenger;',
                '    current = current.next;',
                '  }',
                '  return null;',
                '}'
            ],
            run: function () {
                var searchId = parseInt(document.getElementById('runHtSearchId').value);
                var steps = [];
                var capacity = 7;
                var index = searchId % capacity;

                steps.push({ line: 0, type: 'highlight', text: '🗂️ Starting HashTable.search(' + searchId + ')' });
                steps.push({ line: 2, type: 'highlight', text: 'hash(' + searchId + ') = ' + searchId + ' % ' + capacity + ' = <strong>' + index + '</strong>' });
                steps.push({ line: 3, type: 'traverse', text: 'Accessing table[' + index + ']' });

                var bucket = Object.values(passengersMap).filter(function (p) { return p.passengerId % capacity === index; });

                if (bucket.length === 0) {
                    steps.push({ line: 4, type: 'compare', text: 'current == null? → YES (empty bucket)' });
                    steps.push({ line: 9, type: 'traverse', text: '❌ Not found! Returning <strong>null</strong>' });
                    return { steps: steps, failed: true };
                }

                var found = null;
                for (var i = 0; i < bucket.length; i++) {
                    steps.push({ line: 4, type: 'compare', text: 'current != null? → YES (entry #' + bucket[i].passengerId + ': "' + bucket[i].name + '")' });
                    steps.push({ line: 5, type: 'compare', text: bucket[i].passengerId + ' == ' + searchId + '? → ' + (bucket[i].passengerId === searchId ? 'YES! ✅' : 'NO') });
                    if (bucket[i].passengerId === searchId) {
                        steps.push({ line: 6, type: 'success', text: '✅ Found! "' + bucket[i].name + '" (NIC: ' + bucket[i].nic + ')' });
                        found = bucket[i];
                        break;
                    }
                    steps.push({ line: 7, type: 'traverse', text: 'current = current.next' });
                }

                if (!found) {
                    steps.push({ line: 4, type: 'compare', text: 'current == null → end of chain' });
                    steps.push({ line: 9, type: 'traverse', text: '❌ Not found in bucket[' + index + ']' });
                }

                return { steps: steps, foundPassenger: found };
            }
        }
    }
};

// ===== FORM DYNAMIC FIELDS =====

function updateRunOps() {
    var ds = document.getElementById('runDS').value;
    var opSelect = document.getElementById('runOp');
    var defs = runOperationDefs[ds];
    opSelect.innerHTML = '';
    for (var op in defs) {
        var opt = document.createElement('option');
        opt.value = op;
        opt.textContent = defs[op].label;
        opSelect.appendChild(opt);
    }
    updateRunFields();
}

function updateRunFields() {
    var ds = document.getElementById('runDS').value;
    var op = document.getElementById('runOp').value;
    var fieldsRow = document.getElementById('runFieldsRow');
    var defs = runOperationDefs[ds];
    if (!defs || !defs[op]) return;

    var fields = defs[op].fields;
    var html = '';
    fields.forEach(function (f) {
        html += '<div class="form-group">' +
            '<label>' + f.label + '</label>' +
            '<input type="' + f.type + '" id="' + f.id + '" placeholder="' + f.placeholder + '">' +
            '</div>';
    });
    fieldsRow.innerHTML = html;
}

function resetRunPanel() {
    var el = document.getElementById('runPanel');
    el.classList.remove('running');
    document.getElementById('runSteps').innerHTML = '<p class="ds-empty-msg">Select a data structure and operation to begin...</p>';
    document.getElementById('runCodeBlock').innerHTML = '<span style="color:#6c7086;">// Select an operation to see code here</span>';
    updateRunOps();
}

// ===== RENDER CODE WITH LINE NUMBERS =====

function renderRunCode(codeLines, activeLine, doneLines) {
    var el = document.getElementById('runCodeBlock');
    var html = '';
    codeLines.forEach(function (line, i) {
        var cls = '';
        if (i === activeLine) cls = 'active-line';
        else if (doneLines && doneLines.indexOf(i) !== -1) cls = 'done-line';
        var escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += '<span class="code-line ' + cls + '"><span class="line-no">' + (i + 1) + '</span>' + escaped + '</span>\n';
    });
    el.innerHTML = html;

    // Scroll active line into view
    if (activeLine !== undefined && activeLine >= 0) {
        var activeEl = el.querySelector('.active-line');
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ===== ADD STEP TO LOG =====

function addRunStep(step, stepNum, totalSteps) {
    var container = document.getElementById('runSteps');
    // Remove empty state message
    if (stepNum === 1) container.innerHTML = '';

    var div = document.createElement('div');
    var typeClass = 'step-highlight';
    if (step.type === 'success') typeClass = 'step-success';
    else if (step.type === 'compare') typeClass = 'step-compare';
    else if (step.type === 'traverse') typeClass = 'step-traverse';
    div.className = 'run-step ' + typeClass;
    div.innerHTML = '<span class="run-step-num">' + stepNum + '</span>' +
        '<span class="run-step-text">' + step.text + '</span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ===== STEP-BY-STEP EXECUTION =====

var runTimers = [];

function clearRunTimers() {
    runTimers.forEach(function (t) { clearTimeout(t); });
    runTimers = [];
}

function runOperationStepByStep() {
    var ds = document.getElementById('runDS').value;
    var op = document.getElementById('runOp').value;
    var defs = runOperationDefs[ds];
    if (!defs || !defs[op]) return;

    clearRunTimers();
    var panel = document.getElementById('runPanel');
    panel.classList.add('running');

    var result = defs[op].run();
    var steps = result.steps;
    var codeLines = defs[op].code;
    var speed = parseInt(document.getElementById('runSpeed').value) || 800;

    // Reset views
    document.getElementById('runSteps').innerHTML = '';
    renderRunCode(codeLines, -1, []);

    var doneLines = [];
    steps.forEach(function (step, i) {
        var timer = setTimeout(function () {
            addRunStep(step, i + 1, steps.length);
            doneLines.push(step.line);
            renderRunCode(codeLines, step.line, doneLines);

            // Highlight the relevant DS visual
            if (ds === 'linkedList') renderLinkedList();
            else if (ds === 'queue') renderQueue();
            else if (ds === 'stack') renderStack();
            else if (ds === 'bst') renderBST();
            else if (ds === 'hashTable') renderHashTable();

            // Last step — done
            if (i === steps.length - 1) {
                panel.classList.remove('running');
                setTimeout(function () {
                    if (ds === 'linkedList') renderLinkedList();
                    else if (ds === 'queue') renderQueue();
                    else if (ds === 'stack') renderStack();
                    else if (ds === 'bst') renderBST();
                    else if (ds === 'hashTable') renderHashTable();
                }, 1500);
            }
        }, speed * (i + 1));
        runTimers.push(timer);
    });
}

// ===== INSTANT EXECUTION =====

function runOperationInstant() {
    var ds = document.getElementById('runDS').value;
    var op = document.getElementById('runOp').value;
    var defs = runOperationDefs[ds];
    if (!defs || !defs[op]) return;

    clearRunTimers();
    var panel = document.getElementById('runPanel');
    panel.classList.add('running');

    var result = defs[op].run();
    var steps = result.steps;
    var codeLines = defs[op].code;

    // Show all steps at once
    document.getElementById('runSteps').innerHTML = '';
    var allDoneLines = [];
    steps.forEach(function (step, i) {
        addRunStep(step, i + 1, steps.length);
        allDoneLines.push(step.line);
    });

    // Show final code state
    var lastLine = steps[steps.length - 1].line;
    renderRunCode(codeLines, lastLine, allDoneLines);

    panel.classList.remove('running');

    // Refresh visuals
    if (ds === 'linkedList') renderLinkedList();
    else if (ds === 'queue') renderQueue();
    else if (ds === 'stack') renderStack();
    else if (ds === 'bst') renderBST();
    else if (ds === 'hashTable') renderHashTable();
}

// ===== INIT ON LOAD =====

document.addEventListener('DOMContentLoaded', function () {
    updateRunOps();
});
