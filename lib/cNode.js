
import * as util from "./util.js"
import * as encPar from "./encodings/enc1-Par.js"

//- used to simulate DOM-based nodes
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

constructor(name) {
  this.name = name;
}

//########//########//########//########//########
//========//========//========//========//========

def() {
  return this.name;
}

//========//========//========//========//========

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

testEqual(other) {
  let rThis = encPar.encodePRE(this);
  let rOther = encPar.encodePRE(other);
  let result = 0;

  result = util.cmpArrays(rThis.n, rOther.n);
  if(result != 0) return result;

  result = util.cmpArrays(rThis.par, rOther.par);
  return result;
}

//========//========//========//========//========

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

addAsFirstChild(node) {
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

get childNodesFTL() {
  return this.childNodes;
}

//========//========//========//========//========

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

get childNodesLTF() {
  return this.childNodesRev;
}

//========//========//========//========//========

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
