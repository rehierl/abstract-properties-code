
import * as util from "../util.js"
import cNode from "../cNode.js"
import cQueue from "../cQueue.js"

//- the level-based implicit encoding
//########//########//########//########//########
//========//========//========//========//========

export function encodeLEVEL(root) {
  let next = new cQueue();
  next.enqueue(root);
  let n=[], lvl=[];

  while(next.hasNext) {
    let node = next.dequeue();

    //- visit the node
    n.push(node.def());
    node.ref = n.length;

    let parent = node.parentNode;
    let level = parent ? parent.lvl : 0;
    node.lvl = (level + 1);
    lvl.push(node.lvl);

    //- plan the visit of each child
    for(let child of node.childNodesFTL) {
      next.enqueue(child);
    }
  }

  return { n, lvl };
}

//========//========//========//========//========

export function decodeLEVEL(n, lvl) {
  util.assert(false);//- no decoding possible
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePRE(root) {
  return encodePREv1(root);
}

//========//========//========//========//========

export function encodePREv1(root) {
  let n=[], lvl=[], rp=[];

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    //- push the current node onto the rooted path
    rp.push(node);

    //- visit the node
    n.push(node.def());
    lvl.push(rp.length);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- exit the node's type-1 scope
    //- pop the current node from the rooted path
    node = rp.pop();
  }

  visitPreFTL(root);
  return { n, lvl };
}

//========//========//========//========//========

export function encodePREv2(root) {
  let n=[], lvl=[];
  let level = 0;

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    level = (level + 1);

    //- visit the node
    n.push(node.def());
    lvl.push(level);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- exit the node's type-1 scope
    level = (level - 1);
  }

  visitPreFTL(root);
  return { n, lvl };
}

//========//========//========//========//========

//- assuming `n` is in pre-order
export function decodePRE(n, lvl) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == lvl.length);
  util.assert(lvl[0] == 1);//- a root
  let nodes=[], roots=[], rp=[]
  let last = 0;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes.push(node);

    let level = lvl[i];
    util.assert(level >= 1);
    node.lvl = level;

    //- assert that the input level does
    //  not exceed the valid range [1,#rp+1]
    util.assert(level <= (last+1));
    rp[level-1] = node;
    last = level;

    //- if the node is a root
    if(level == 1) {
      roots.push(node);
      continue;
    }

    //- the node is a child
    let parent = rp[level-2];
    parent.addAsLastChild(node);
  }

  return roots;
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePOST(root) {
  let n=[], lvl=[];
  let level = 0;

  function visitPostFTL(node) {
    //- enter the node's type-1 scope
    level = (level + 1);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPostFTL(child);
    }

    //- visit the node
    n.push(node.def());
    lvl.push(level);

    //- exit the node's type-1 scope
    level = (level - 1);
  }

  visitPostFTL(root);
  return { n, lvl };
}

//========//========//========//========//========

//- assuming `n` is in post-order
export function decodePOST(n, lvl) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == lvl.length);
  util.assert(lvl[len-1] == 1);//- a root
  let nodes=[], roots=[], rp=[]
  let last = 0;

  for(let i=len-1; i>=0; i--) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes[i] = node;//- hashtable!

    let level = lvl[i];
    util.assert(level >= 1);
    node.lvl = level;

    //- assert that the input level does
    //  not exceed the valid range [1,#rp+1]
    util.assert(level <= (last+1));
    rp[level-1] = node;
    last = level;

    //- if the node is a root
    if(level == 1) {
      roots.push(node);
      continue;
    }

    //- the node is a child
    let parent = rp[level-2];
    parent.addAsFirstChild(node);
  }

  return roots;
}
