
import * as util from "../util.js"
import cNode from "../cNode.js"
import cQueue from "../cQueue.js"

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

export function encodePRE(root) {
  return encodePREv2(root);
}

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
  //let level = 0;

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    //level = (level + 1);

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
    //level = (level - 1);
  }

  visitPreFTL(root);
  return { n, len };
}

//========//========//========//========//========

export function decodePRE(n, len) {
  return decodePREv1(n, len);
}

//========//========//========//========//========

//- assuming `n` is in pre-order
export function decodePREv1(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- a root
  util.assert(len[num-1] == 1);//- a leaf
  let nodes=[], roots=[], rp=[];

  for(let i=0; i<num; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    nodes.push(current);//- hashtable!

    let count = len[i];
    current.count = count;
    current.remaining = count;
    let pLen = rp.length;

    if(pLen == 0) {
      roots.push(current);
    }

    if(pLen > 0) {
      let parent = rp[pLen-1];
      util.assert(count <= parent.remaining);
      parent.addAsLastChild(current);
    }

    rp.push(current);
    pLen = rp.length;

    //- first, reduce all node counts
    for(let i=0; i<pLen; i++) {
      rp[i].remaining--;
    }

    //- then, pop entries if necessary
    for(let i=pLen-1; i>=0; i--) {
      if(rp[i].remaining > 0) break;
      rp.pop();
    }
  }

  util.assert(rp.length == 0);
  util.assert(roots.length == 1);
  return roots[0];
}

//========//========//========//========//========

//- assuming `n` is in pre-order
//- a version that is slightly more efficient
//  since it does not always reduce the node
//  count of each node in the rooted path
export function decodePREv2(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- a root
  util.assert(len[num-1] == 1);//- a leaf
  let nodes=[], roots=[], rp=[];

  for(let i=0; i<num; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    nodes.push(current);//- hashtable!

    let count = len[i];
    current.count = count;
    current.remaining = count;
    let pLen = rp.length;

    if(pLen == 0) {
      roots.push(current);
    }

    if(pLen > 0) {
      let parent = rp[pLen-1];
      util.assert(count <= parent.remaining);
      parent.addAsLastChild(current);
    }

    rp.push(current);
    current.remaining--;

    while(true) {
      pLen = rp.length;
      if(pLen == 0) break;

      let node = rp[pLen-1];
      if(node.remaining > 0) break;

      rp.pop();
      pLen -= 1;

      if(pLen == 0) break;
      let parent = rp[pLen-1];
      parent.remaining -= node.count;
    }
  }

  util.assert(rp.length == 0);
  util.assert(roots.length == 1);
  return roots[0];
}

//########//########//########//########//########
//========//========//========//========//========

export function encodePOST(root) {
  let n=[], len=[];
  //let level = 0;

  function visitPostFTL(node) {
    //- enter the node's type-1 scope
    //level = (level + 1);

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
    //level = (level - 1);
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
  let nodes=[], roots=[], rp=[];

  for(let i=num-1; i>=0; i--) {//- i in [0,#n)
    let current = new cNode(n[i]);
    nodes[i] = current;//- hashtable!

    let count = len[i];
    current.count = count;
    current.remaining = count;
    let pLen = rp.length;

    if(pLen == 0) {
      roots.push(current);
    }

    if(pLen > 0) {
      let parent = rp[pLen-1];
      util.assert(count <= parent.remaining);
      parent.addAsFirstChild(current);
    }

    rp.push(current);
    pLen = rp.length;

    //- first, reduce all node counts
    for(let i=0; i<pLen; i++) {
      rp[i].remaining--;
    }

    //- then, pop entries if necessary
    for(let i=pLen-1; i>=0; i--) {
      if(rp[i].remaining > 0) break;
      rp.pop();
    }
  }

  util.assert(rp.length == 0);
  util.assert(roots.length == 1);
  return roots[0];
}
