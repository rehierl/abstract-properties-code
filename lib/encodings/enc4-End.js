
import * as util from "../util.js"
import cNode from "../cNode.js"

//- the end/first/last-based implicit encoding
//########//########//########//########//########
//========//========//========//========//========

//- note - 1/one-based sequences
//- note - 0/zero-based arrays
export function encodePRE(root) {
  let n=[], lst=[];
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
    lst[first] = last+1;

    //- exit the node's type-1 scope
    //level = (level - 1);
  }

  visitPreFTL(root);
  return { n, lst };
}

//========//========//========//========//========

//- assuming `n` is in pre-order
export function decodePRE(n, lst) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == lst.length);
  util.assert(lst[0] == len);//- a root
  util.assert(lst[len-1] == len);//- a leaf
  let nodes=[], roots=[], rp=[];

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    nodes.push(current);

    let first = i;
    let last = lst[i]-1;
    util.assert(last >= i);
    util.assert(last < len);

    let count = (last - first + 1);
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

//########//########//########//########//########
//========//========//========//========//========

export function encodePOST(root) {
  let n=[], fst=[];
  //let level = 0;

  function visitPostFTL(node) {
    //- enter the node's type-1 scope
    //level = (level + 1);

    //- keep track of the index of the first
    //  node in the current scope
    //- none of these nodes have been appended to
    //  'n', which is why the first node will be
    //  located at the 0-based index (n.length-1+1)
    let first = n.length;

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPostFTL(child);
    }

    //- visit the node
    n.push(node.def());
    let last = n.length-1;
    fst[last] = first+1;

    //- exit the node's type-1 scope
    //level = (level - 1);
  }

  visitPostFTL(root);
  return { n, fst };
}

//========//========//========//========//========

//- assuming `n` is in post-order
export function decodePOST(n, fst) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == fst.length);
  util.assert(fst[len-1] == 1);//- a root
  util.assert(fst[0] == 1);//- a leaf
  let nodes=[], roots=[], rp=[];

  for(let i=len-1; i>=0; i--) {//- i in [0,#n)
    let current = new cNode(n[i]);
    nodes[i] = current;//- hashtable!

    let first = fst[i]-1;
    let last = i;
    util.assert(first >= 0);
    util.assert(first <= i);

    let count = (last - first + 1);
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
