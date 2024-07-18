class SlidingWindowMedian {
    constructor(k) {
        this.k = k;
        this.minHeap = [];
        this.maxHeap = [];
    }

    add(num) {
        if (this.maxHeap.length === 0 || num <= this.maxHeap[0]) {
            this.maxHeap.push(num);
            this.maxHeap.sort((a, b) => b - a);
        } else {
            this.minHeap.push(num);
            this.minHeap.sort((a, b) => a - b);
        }

        // Balance the heaps
        if (this.maxHeap.length > this.minHeap.length + 1) {
            this.minHeap.push(this.maxHeap.shift());
            this.minHeap.sort((a, b) => a - b);
        } else if (this.minHeap.length > this.maxHeap.length) {
            this.maxHeap.push(this.minHeap.shift());
            this.maxHeap.sort((a, b) => b - a);
        }
    }

    remove(num) {
        if (num <= this.maxHeap[0]) {
            const index = this.maxHeap.indexOf(num);
            if (index > -1) this.maxHeap.splice(index, 1);
        } else {
            const index = this.minHeap.indexOf(num);
            if (index > -1) this.minHeap.splice(index, 1);
        }

        // Balance the heaps
        if (this.maxHeap.length > this.minHeap.length + 1) {
            this.minHeap.push(this.maxHeap.shift());
            this.minHeap.sort((a, b) => a - b);
        } else if (this.minHeap.length > this.maxHeap.length) {
            this.maxHeap.push(this.minHeap.shift());
            this.maxHeap.sort((a, b) => b - a);
        }
    }

    findMedian() {
        if (this.maxHeap.length === this.minHeap.length) {
            return (this.maxHeap[0] + this.minHeap[0]) / 2;
        } else {
            return this.maxHeap[0];
        }
    }

    maintainWindow(nums) {
        const result = [];
        for (let i = 0; i < nums.length; i++) {
            this.add(nums[i]);
            if (i >= this.k) {
                this.remove(nums[i - this.k]);
            }
            if (i >= this.k - 1) {
                result.push(this.findMedian());
            }
        }
        return result;
    }
}
// Priority Queue implementation
class PriorityQueue {
    constructor(compare) {
        this.compare = compare;
        this.data = [];
    }

    enqueue(element) {
        this.data.push(element);
        this._heapifyUp(this.data.length - 1);
    }

    dequeue() {
        const result = this.data[0];
        const end = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = end;
            this._heapifyDown(0);
        }
        return result;
    }

    front() {
        return this.data[0];
    }

    size() {
        return this.data.length;
    }

    _heapifyUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.compare(this.data[currentIndex], this.data[parentIndex]) < 0) {
                [this.data[currentIndex], this.data[parentIndex]] = [this.data[parentIndex], this.data[currentIndex]];
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    _heapifyDown(index) {
        let currentIndex = index;
        const length = this.data.length;
        const element = this.data[currentIndex];

        while (true) {
            let leftChildIndex = 2 * currentIndex + 1;
            let rightChildIndex = 2 * currentIndex + 2;
            let leftChild, rightChild;
            let swapIndex = null;

            if (leftChildIndex < length) {
                leftChild = this.data[leftChildIndex];
                if (this.compare(leftChild, element) < 0) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.data[rightChildIndex];
                if (
                    (swapIndex === null && this.compare(rightChild, element) < 0) ||
                    (swapIndex !== null && this.compare(rightChild, leftChild) < 0)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;
            this.data[currentIndex] = this.data[swapIndex];
            this.data[swapIndex] = element;
            currentIndex = swapIndex;
        }
    }
}

class MinPriorityQueue extends PriorityQueue {
    constructor() {
        super((a, b) => a - b);
    }
}

class MaxPriorityQueue extends PriorityQueue {
    constructor() {
        super((a, b) => b - a);
    }
}

// Example usage
const arr = [1, 2, 2, 9, 1, 6, 7, 8, 2];
const k = 1;
const slidingWindowMedian = new SlidingWindowMedian(k);

const result = slidingWindowMedian.maintainWindow(arr);
console.log(result); // This will output the median of the sliding windows
