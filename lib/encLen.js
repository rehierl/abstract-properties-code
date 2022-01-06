
import * as util from "./util.js"
import cNode from "./cNode.js"
import cQueue from "./cQueue.js"
import cPathLen from "./cPathLen.js"

//- the length-based implicit encoding
//########//########//########//########//########
//========//========//========//========//========

export function encodeLEVEL(root) {
  let n=[], len=[];

  //- recursively determine #D*(n)
  //- used to pre-determine all node counts
  function nodeCountOf(node) {
    //- if the result is already available
    if(node.len !== undefined) {
      return node.len
    }

    //- count the node itself
    let count = 1;

    //- visit all child nodes
    for(let child of node.childNodes) {
      count = count + nodeCountOf(child);
    }

    //- store the result of each node
    node.len = count;
    return count;
  }

  //- traverse the tree in level-order
  function visitLevelFTL(node) {
    let next = new cQueue();
    next.enqueue(root);

    while(next.hasNext) {
      let node = next.dequeue();

      //- visit the node
      n.push(node.def());
      len.push(node.len);

      //- plan the visit of each child
      for(let child of node.childNodesFTL) {
        next.enqueue(child);
      }
    }
  }

  let count = nodeCountOf(root);
  visitLevelFTL(root);

  return { n, len };
}

//========//========//========//========//========

export function decodeLEVEL(n, lvl) {
  util.assert(false);//- no decoding possible
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePREv1(root) {
  let n=[], len=[], nc=[];
  let level = 0;

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    level = (level + 1);

    //- visit the node
    n.push(node.def());
    let first = n.length-1;

    //- initialize the counter for the current
    //  node - by including/counting itself
    nc[level] = 1;

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);

      //- add the number of nodes of the
      //  induced subtree T[child] to the
      //  node count of the current node
      nc[level] = nc[level] + nc[level+1];
    }

    //- replace the initial node count
    let length = nc[level];
    len[first] = length;

    //- exit the node's type-1 scope
    level = (level - 1);
  }

  visitPreFTL(root);
  return { n, len };
}

//========//========//========//========//========

export function encodePREv2(root) {
  let n=[], len=[];
  let level = 0;

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    level = (level + 1);

    //- visit the node
    n.push(node.def());
    let first = n.length-1;

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- determine the length
    let last = n.length-1;
    let length = (last - first + 1);
    len[first] = length;

    //- exit the node's type-1 scope
    level = (level - 1);
  }

  visitPreFTL(root);
  return { n, len };
}

//========//========//========//========//========

export function encodePRE(root) {
  return encodePREv2(root);
}

//========//========//========//========//========

//- assuming `n` is in pre-order
export function decodePRE(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- a root
  util.assert(len[num-1] == 1);//- a leaf
  let nodes=[], roots=[];
  let rp = new cPathLen();

  for(let i=0; i<num; i++) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes.push(node);

    let count = len[i];
    rp.push(node, count);

    if(rp.length == 1) {
      roots.push(node);
    }

    if(rp.length > 1) {
      let parent = rp.parentNode;
      parent.addAsLastChild(node);
    }

    //- reduce the node count of each node
    //  and pop all the nodes that have a
    //  remaining node count of 0/zero
    rp.pop();
  }

  util.assert(rp.length == 0);
  return roots;
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePOST(root) {
  let n=[], len=[];
  let level = 0;

  function visitPostFTL(node) {
    //- enter the node's type-1 scope
    level = (level + 1);

    //- keep track of the index of the first
    //  node in the current scope
    //- none of these nodes have been appended to
    //  'n', which is why the first node will be
    //  located at the 0-based index (n.length-1+1)
    let first = (n.length);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPostFTL(child);
    }

    //- visit the node
    n.push(node.def());
    let last = n.length-1;
    let length = (last - first + 1);
    len.push(length);

    //- exit the node's type-1 scope
    level = (level - 1);
  }

  visitPostFTL(root);
  return { n, len };
}

//========//========//========//========//========

//- assuming `n` is in post-order
export function decodePOST(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[num-1] == num);//- a root
  util.assert(len[1] == 1);//- a leaf
  let nodes=[], roots=[];
  let rp = new cPathLen();

  for(let i=num-1; i>=0; i--) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes[i] = node;//- hashtable!

    let count = len[i];
    rp.push(node, count);

    if(rp.length == 1) {
      roots.push(node);
    }

    if(rp.length > 1) {
      let parent = rp.parentNode;
      parent.addAsFirstChild(node);
    }

    rp.pop();
  }

  util.assert(rp.length == 0);
  return roots;
}
