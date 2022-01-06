
import * as util from "./util.js"

//- a simple array-based queue
export default class cQueue {
//########//########//########//########//########
//========//========//========//========//========

items = [];
offset = 0;

//########//########//########//########//########
//========//========//========//========//========

enqueue(node) {
  this.items.push(node);
}

//========//========//========//========//========

get length() {
  let first = this.offset;
  let last = this.items.length-1;
  return (last - first + 1);
}

//========//========//========//========//========

get isEmpty() {
  return (this.length == 0);
}

//========//========//========//========//========

get hasNext() {
  return (this.length > 0);
}

//========//========//========//========//========

dequeue() {
  util.assert(this.length > 0);
  let off = this.offset++;
  return this.items[off];
}

//========//========//========//========//========

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
