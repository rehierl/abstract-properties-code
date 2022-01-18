
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hrp - a hierarchy of rooted paths
//########//########//########//########//########
//========//========//========//========//========

//- returns a pre-order trace of rooted paths
//- each rooted path in the hierarchy of rooted paths
//  "hrp" is a sequence of node references, and each
//  reference is an index into the sequence of node
//  definitions "n"
export function encodeHrp(root) {
  let n=[], hrp=[], rp=[], path;

  //- form the current rooted path
  function toRootedPath(rp) {
    let path = new Array();
    for(let node of rp) {
      path.push(node.ref);
    }
    return path;
  }

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    rp.push(node);

    //- visit the current node
    n.push(node.def());
    node.ref = n.length;
    path = toRootedPath(rp);
    hrp.push(path);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- exit the node's type-1 scope
    rp.pop();
  }

  visitPreFTL(root);
  return { n, hrp };
}

//########//########//########//########//########
//========//========//========//========//========

//- assuming the sequences are in pre-order
export function decodeHrp(n, hrp) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == hrp.length);
  util.assert(hrp[0].length == 1);
  let nodes=[], roots=[];
  let rp=[], pOld, pCur;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    current.ref = (i+1);
    nodes.push(current);

    //- pCur must have the current node
    //  as its characteristic element CE
    //- as its last element
    pCur = hrp[i];

    //- if the node is a root
    if(pCur.length == 1) {
      util.assert(pCur[0] == i+1);
      roots.push(current);
      rp.push(current);
      pOld = pCur;
      continue;
    }

    //- reduce the rooted path to those
    //  nodes that are common to both
    //- reduce rp to the shared prefix
    reduceRp(pOld, pCur, rp);
    let pLen = rp.length;

    //- this node must be the path's CE
    //- a reference to the current node
    util.assert(pCur[pLen] == i+1);

    //- the current node's parent is the
    //  last node in the reduced rooted path
    let parent = rp[pLen-1];
    parent.addAsLastChild(current);

    //- 'rp' must now be equal to 'pCur'
    rp.push(current);
    pOld = pCur;
    continue;
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//========//========//========//========//========

//- reduce the rooted path 'rp' to those
//  nodes that are common to both paths
function reduceRp(pOld, pCur, rp) {
  let len1 = pOld.length;
  let len2 = pCur.length;
  let jx, jc=Math.min(len1, len2);

  for(jx=0; jx<jc; jx++) {
    let e1 = pOld[jx];
    let e2 = pCur[jx];
    if(e1 != e2) break;
  }

  //- jx may be equal to jc, in which case
  //  the shorter path is a prefix to the other
  //- jx may be smaller than jc, in which case
  //  both share a common prefix of length 'jx'
  util.assert(jx > 0);
  let pLen = jx;

  //- 'rp' must still be equal to 'pOld'
  util.assert(rp.length == pOld.length);

  //- reduce 'rp' to the prefix of both
  while(rp.length > pLen) {
    rp.pop();
  }

  //- 'pCur' must now have one node on
  //  top of those in the shared prefix
  util.assert(pLen == pCur.length-1);
}
