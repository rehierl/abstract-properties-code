
import * as util from "./util.js"

//- used to decode in encLen.js and encEnd.js
export default class cPathLen {
//########//########//########//########//########
//========//========//========//========//========

//- a stack of entry objects
//- entry.node - a node object
//- entry.count - the node count of the node's scope
//- entry.remaining - how many .pop() calls are left
//  before the entry will be removed from the stack
items = [];

//########//########//########//########//########
//========//========//========//========//========

get length() {
  return this.items.length;
}

//========//========//========//========//========

get currentNode() {
  let tos = this.items.length-1;
  util.assert(tos >= 0);
  return this.items[tos].node;
}

//========//========//========//========//========

get parentNode() {
  let tos = this.items.length-1;
  util.assert(tos >= 1);
  return this.items[tos-1].node;
}

//########//########//########//########//########
//========//========//========//========//========

push(node, count) {
  let entry = {};
  entry.node = node;
  entry.count = count;
  entry.remaining = count;
  this.items.push(entry);

  let tos = this.items.length-1;
  if(tos == 0) return;
  let parent = this.items[tos];

  //- recall the DI-RE case with scopes
  util.assert(count <= parent.remaining);
}

//========//========//========//========//========

pop() {
  let tos = this.items.length-1;
  util.assert(tos >= 0);

  //- first, reduce all node counts
  for(let i=tos; i>=0; i--) {
    let entry = this.items[i];
    entry.remaining -= 1;
  }

  //- then, pop entries if necessary
  for(let i=tos; i>=0; i--) {
    let entry = this.items[i];
    //- the item is not yet done
    if(entry.remaining > 0) return;
    //- the item is done - pop it
    this.items.pop();
  }
}

//########//########//########//########//########
//========//========//========//========//========
}//- class
