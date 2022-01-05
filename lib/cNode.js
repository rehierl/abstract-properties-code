
import * as util from "./util.js"

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
  return;
}

//========//========//========//========//========

def() {
  return this.name;
}

//########//########//########//########//########
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
  }
  else {//- had a last child
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
  }
  else {//- had a last child
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

//########//########//########//########//########
//========//========//========//========//========
}//- class
