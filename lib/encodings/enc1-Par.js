
import * as util from "../util.js"
import cNode from "../cNode.js"
import cQueue from "../cQueue.js"

//- the parent-based explicit encoding
//########//########//########//########//########
//========//========//========//========//========

export function encodeLEVEL(root) {
  let next = new cQueue();
  next.enqueue(root);
  let n=[], r=[], par=[];

  while(next.hasNext) {
    let node = next.dequeue();

    //- visit the node
    n.push(node.def());
    node.ref = n.length;
    r.push(node.ref);

    let parent = node.parentNode;
    let parRef = parent ? parent.ref : 0;
    par.push(parRef);

    //- plan the visit of each child
    for(let child of node.childNodesFTL) {
      next.enqueue(child);
    }
  }

  return { n, par };
}

//========//========//========//========//========

//- same as decodePRE()
//- assuming `n` is in level-order
export function decodeLEVEL(n, par) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == par.length);
  util.assert(par[0] <= 0);//- a root
  let nodes=[], roots=[];

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes.push(node);
    let ref = par[i];

    //- a root
    if(ref <= 0) {
      roots.push(node);
      continue;
    }

    //- invalid reference
    if(ref > n.length) {
      util.assert(false);
    }

    //- a cyclic graph
    if((ref-1) >= i) {
      util.assert(false);
    }

    let parent = nodes[ref-1];
    parent.addAsLastChild(node);
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//########//########//########//########//########
//========//========//========//========//========

export function debugPRE(root) {
  console.log("node tree (par, pre-order)");
  let ret = encodePRE(root);
  console.log("N", ret.n);
  console.log("P", ret.par);
}

//========//========//========//========//========

export function encodePRE(root) {
  let n=[], par=[];

  function visitPreFTL(node) {
    //- visit the node
    n.push(node.def());
    node.ref = n.length;

    let parent = node.parentNode;
    let parRef = parent ? parent.ref : 0;
    par.push(parRef);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }
  }

  visitPreFTL(root);
  return { n, par };
}

//========//========//========//========//========

//- same as decodeLEVEL()
//- assuming `n` is in pre-order
export function decodePRE(n, par) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == par.length);
  util.assert(par[0] <= 0);//- a root
  let nodes=[], roots=[];

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes.push(node);
    let ref = par[i];

    //- a root
    if(ref <= 0) {
      roots.push(node);
      continue;
    }

    //- invalid reference
    if(ref > n.length) {
      util.assert(false);
    }

    //- a cyclic graph
    if((ref-1) >= i) {
      util.assert(false);
    }

    let parent = nodes[ref-1];
    parent.addAsLastChild(node);
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePRER(root) {
  let n=[], par=[];

  function visitPreLTF(node) {
    //- visit the node
    n.push(node.def());
    node.ref = n.length;

    let parent = node.parentNode;
    let parRef = parent ? parent.ref : 0;
    par.push(parRef);

    //- visit the child nodes
    for(let child of node.childNodesLTF) {
      visitPreLTF(child);
    }
  }

  visitPreLTF(root);
  return { n, par };
}

//========//========//========//========//========

//- assuming `n` is in reversed pre-order
export function decodePRER(n, par) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == par.length);
  util.assert(par[0] <= 0);//- a root
  let nodes=[], roots=[];

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes.push(node);
    let ref = par[i];

    //- a root
    if(ref <= 0) {
      roots.push(node);
      continue;
    }

    //- invalid reference
    if(ref > n.length) {
      util.assert(false);
    }

    //- a cyclic graph
    if((ref-1) >= i) {
      util.assert(false);
    }

    let parent = nodes[ref-1];
    parent.addAsFirstChild(node);
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePOST(root) {
  let nodes=[], n=[], par=[];

  function visitPostFTL(node) {
    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPostFTL(child);
    }

    //- visit the node
    nodes.push(node);
    n.push(node.def());
    node.ref = n.length;
  }

  visitPostFTL(root);
  let len = nodes.length;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let parent = nodes[i].parentNode;
    let parRef = parent ? parent.ref : len+1;
    par.push(parRef);
  }

  return { n, par };
}

//========//========//========//========//========

//- assuming `n` is in post-order
export function decodePOST(n, par) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == par.length);
  util.assert(par[len-1] >= len);//- a root
  let nodes=[], roots=[];

  for(let i=len-1; i>=0; i--) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes[i] = node;//- hashtable!
    let ref = par[i];

    //- a root
    if(ref > len) {
      roots.push(node);
      continue;
    }

    //- invalid reference
    if(ref <= 0) {
      util.assert(false);
    }

    //- a cyclic graph
    if((ref-1) <= i) {
      util.assert(false);
    }

    //- (ref-1) in (i,#n)
    let parent = nodes[ref-1];
    parent.addAsFirstChild(node);
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePOSTR(root) {
  let nodes=[], n=[], par=[];

  function visitPostLTF(node) {
    //- visit the child nodes
    for(let child of node.childNodesLTF) {
      visitPostLTF(child);
    }

    //- visit the node
    nodes.push(node);
    n.push(node.def());
    node.ref = n.length;
  }

  visitPostLTF(root);
  let len = nodes.length;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let parent = nodes[i].parentNode;
    let parRef = parent ? parent.ref : len+1;
    par.push(parRef);
  }

  return { n, par };
}

//========//========//========//========//========

//- assuming `n` is in reversed post-order
export function decodePOSTR(n, par) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == par.length);
  util.assert(par[len-1] >= len);//- a root
  let nodes=[], roots=[];

  for(let i=len-1; i>=0; i--) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes[i] = node;//- hashtable!
    let ref = par[i];

    //- a root
    if(ref > len) {
      roots.push(node);
      continue;
    }

    //- invalid reference
    if(ref <= 0) {
      util.assert(false);
    }

    //- a cyclic graph
    if((ref-1) <= i) {
      util.assert(false);
    }

    //- (ref-1) in (i,#n)
    let parent = nodes[ref-1];
    parent.addAsLastChild(node);
  }

  util.assert(roots.length == 1);
  return roots[0];
}
