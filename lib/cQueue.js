
import * as util from "./util.js"

//- a simple array-based queue
//- used by level-based tree traversal algorithms
export default class cQueue {
//########//########//########//########//########
//========//========//========//========//========

//- the array-based storage to which new
//  items will be pushed/appended
items = [];

//- the index of the current first item
//- this item will be "dequeued" next
offset = 0;

//########//########//########//########//########
//========//========//========//========//========

//- append the given node to the end
enqueue(node) {
  this.items.push(node);
}

//========//========//========//========//========

//- increase the offset of the current first node,
//  which simulates the removal of that first node
dequeue() {
  util.assert(this.length > 0);
  let offset = this.offset++;
  return this.items[offset];
}

//========//========//========//========//========

//- returns the number of remaining nodes
get length() {
  let first = this.offset;
  let last = this.items.length-1;
  return (last - first + 1);
}

//========//========//========//========//========

//- true, if there are no nodes remaining
get isEmpty() {
  return (this.length == 0);
}

//========//========//========//========//========

//- true, if there are remaining nodes
get hasNext() {
  return (this.length > 0);
}

//========//========//========//========//========

//- returns an array of remaining nodes
//  in first-to-last order
//- for debugging purposes only
get remaining() {
  if(this.length == 0) {
    return [];
  } else {
    let first = this.offset;
    return this.items.slice(first);
  }
}

//########//########//########//########//########
//========//========//========//========//========
}//- class
