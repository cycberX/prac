def heapify(heap, n, i):
    maximum = i
    l = 2 * i + 1
    r = 2 * i + 2

    # if left child exist
    if l < n and heap[i] < heap[l]:
        maximum = l

    # if right child exists
    if r < n and heap[maximum] < heap[r]:
        maximum = r

    # Root
    if maximum != i:
        heap[i], heap[maximum] = heap[maximum], heap[i]
        heapify(heap, n, maximum)


def heapSort(heap):
    n = len(heap)

    # Maxheap
    for i in range(n // 2 - 1, -1, -1):
        heapify(heap, n, i)

    # element extraction
    for i in range(n - 1, 0, -1):
        heap[i], heap[0] = heap[0], heap[i]
        heapify(heap, i, 0)


n = int(input("Enter the number of elements: "))
heap = [n] * n
for i in range(n):
    heap[i] = int(input(f"Enter {i} element: "))

print(heap)
heapSort(heap)
print("\nThe Sorted array is:", heap)
