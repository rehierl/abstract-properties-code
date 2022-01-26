
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hrp - a hierarchy of rooted paths
//########//########//########//########//########
//========//========//========//========//========

//- (Tree -> Hrp)
//- returns a pre-order trace of rooted paths
//- each rooted path in the hierarchy of rooted paths
//  "hrp" is a sequence of node references, and each
//  reference is an index into the sequence of node
//  definitions "n"
export function encodeHrp(root) {
  let n=[], hrp=[];
  let rp=[], path;

  //- clone the current rooted path
  //- in: a path of node objects
  //- out: a path of node references
  function clone(rp) {
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
    path = clone(rp);
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

//- (Hrp -> Tree)
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
    current.ref = (i+1);//- 1-based
    nodes.push(current);
    pCur = hrp[i];

    //- pCur must have the current node
    //  as its characteristic element (CE)
    util.assert(pCur[pCur.length-1] == (i+1));

    //- if the node is a root
    if(pCur.length == 1) {
      roots.push(current);
      rp.push(current);
      pOld = pCur;
      continue;
    }

    //- reduce rp to the shared prefix
    let pLen = reduceRp(pOld, pCur, rp);

    //- the current node's parent is the
    //  last node in the shared prefix
    let parent = rp[pLen-1];
    parent.addAsLastChild(current);

    //- 'rp' is now equal to 'pCur'
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
  //- 'rp' must still be equal to 'pOld'
  util.assert(util.cmpArrays(rp, pOld) == 0);

  //- determine the length of the shared prefix
  let pLen = lengthOfPrefix(pOld, pCur);

  //- reduce 'rp' to the prefix of both
  while(rp.length > pLen) {
    rp.pop();
  }

  //- 'pCur' must now have one node on
  //  top of those in the shared prefix
  util.assert(pLen == pCur.length-1);
  util.assert(pLen == rp.length);
  return pLen;
}

//========//========//========//========//========

//- determine the length of the shared prefix
function lengthOfPrefix(pOld, pCur) {
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
  return jx;
}
