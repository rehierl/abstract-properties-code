
import * as util from "./util.js"
import * as encPar from "./encodings/enc1-Par.js"

//- used to simulate DOM-based node objects
export default class cNode {
//########//########//########//########//########
//========//========//========//========//========

name = undefined;

parentNode = null;
prevSibling = null;
nextSibling = null;

firstChild = null;
lastChild = null;

//========//========//========//========//========

//- used to deserialize an empty (i.e. disconnected)
//  node object based on the string-based node
//  definition provided
constructor(def) {
  this.name = def;
}

//########//########//########//########//########
//========//========//========//========//========

//- used to serialize the definition of a node
//  into a string-based value
//- this definition will be written by algorithms
//  to the sequence of node definitions (i.e. 'n')
def() {
  return this.name;
}

//========//========//========//========//========

//- creates a clone of the induced subtree
//  that has the current node as its root
clone() {
  let parent = new cNode(this.name);
  let child = this.firstChild;

  while(child != null) {
    let node = child.clone();
    parent.addAsLastChild(node);
    child = child.nextSibling;
  }

  return parent;
}

//========//========//========//========//========

//- used to compare two trees for equality
//- used to verify that a resulting tree is as expected
//- returns 0/zero, if both trees are equal
testEqual(other) {
  let rThis = encPar.encodePRE(this);
  let rOther = encPar.encodePRE(other);
  let result = 0;

  //- verify the structure
  result = util.cmpArrays(rThis.par, rOther.par);
  if(result != 0) return result;

  //- verify the node definitions
  result = util.cmpArrays(rThis.n, rOther.n);
  return result;
}

//========//========//========//========//========

//- add the given node as the new last child
addAsLastChild(node) {
  if(this.firstChild == null) {
    //- update the child node
    node.parentNode = this;
    node.prevSibling = null;
    node.nextSibling = null;
    //- update the current node
    this.firstChild = node;
    this.lastChild = node;
  } else {//- had a last child
    //- update the child node
    node.parentNode = this;
    node.prevSibling = this.lastChild;
    node.nextSibling = null;
    //- update the last child
    this.lastChild.nextSibling = node;
    //- update the current node
    this.lastChild = node;
  }
}

//========//========//========//========//========

//- add the given node as the new first child
addAsFirstChild(node) {
  if(this.firstChild == null) {
    //- update the child node
    node.parentNode = this;
    node.prevSibling = null;
    node.nextSibling = null;
    //- update the current node
    this.firstChild = node;
    this.lastChild = node;
  } else {//- had a first child
    //- update the child node
    node.parentNode = this;
    node.prevSibling = null;
    node.nextSibling = this.firstChild;
    //- update the last child
    this.firstChild.prevSibling = node;
    //- update the current node
    this.firstChild = node;
  }
}

//########//########//########//########//########
//========//========//========//========//========

//- return an array of child nodes
//  in first-to-last order
get childNodes() {
  let node = this.firstChild;
  let list = [];

  while(node != null) {
    list.push(node);
    node = node.nextSibling;
  }

  return list;
}

//========//========//========//========//========

//- return an array of child nodes
//  in first-to-last order
get childNodesFTL() {
  return this.childNodes;
}

//========//========//========//========//========

//- return an array of child nodes
//  in last-to-first order
get childNodesRev() {
  let node = this.lastChild;
  let list = [];

  while(node != null) {
    list.push(node);
    node = node.prevSibling;
  }

  return list;
}

//========//========//========//========//========

//- return an array of child nodes
//  in last-to-first order
get childNodesLTF() {
  return this.childNodesRev;
}

//========//========//========//========//========

//- recursively determines the number of nodes
//  in the induced subtree that has the current
//  node as its root
//- in essence the strength of the scope of the
//  current node over the corresponding node order
get nodeCount() {
  let root = this;

  function nodeCountOf(node) {
    let child = node.firstChild;
    let count = 1;

    while(child !== null) {
      count += nodeCountOf(child);
      child = child.nextSibling;
    }

    return count;
  }

  return nodeCountOf(root);
}

//########//########//########//########//########
//========//========//========//========//========
}//- class
