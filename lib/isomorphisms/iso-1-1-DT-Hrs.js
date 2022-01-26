
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hrs - a hierarchy of reversed scopes
//########//########//########//########//########
//========//========//========//========//========

//- (Tree -> Hrs)
//- returns a pre-order trace of reversed scopes
//- i.e. a sequence of simple sets - i.e. A*(n)
//- each scope in "hrs" is a set of node references,
//  and each reference an index into "n"
export function encodeHrs(root) {
  let n=[], hrs=[];
  let rp=[], rscope;

  //- form the current reversed scope
  function toReversedScope(rp) {
    let rscope = new Set();
    for(let node of rp) {
      rscope.add(node.ref);
    }
    return rscope;
  }

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    rp.push(node);

    //- visit the current node
    n.push(node.def());
    node.ref = n.length;
    rscope = toReversedScope(rp);
    hrs.push(rscope);

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- exit the node's type-1 scope
    rp.pop();
  }

  visitPreFTL(root);
  return { n, hrs };
}

//########//########//########//########//########
//========//========//========//========//========

//- (Hrs -> Tree)
//- assuming the sequences are in pre-order
export function decodeHrs(n, hrs) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == hrs.length);
  util.assert(hrs[0].size == 1);
  let nodes=[], roots=[];
  let rp=[], sOld, sCur;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    current.ref = (i+1);//- 1-based
    nodes.push(current);
    sCur = hrs[i];

    //- sCur must have the current node
    //  as its characteristic element CE
    util.assert(sCur.has(i+1));

    //- if the node is a root
    if(sCur.size == 1) {
      roots.push(current);
      rp.push(current);
      sOld = sCur;
      continue;
    }

    //- reduce rp to the shared subset
    let pLen = reduceRp(sOld, sCur, rp);

    //- get the CE of sCur
    //- must be equal to the current node
    let ceRef = getCeRef(sOld, sCur);
    util.assert(ceRef == i+1);

    //- the current node's parent is the
    //  last node in the reduced rooted path
    let parent = rp[pLen-1];
    parent.addAsLastChild(current);

    //- E(rp) is now equal to 'sCur'
    rp.push(current);
    sOld = sCur;
    continue;
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//========//========//========//========//========

//- reduce the rooted path to those
//  nodes that are common to both
//- all nodes in sOld, but not in sCur
//  are descendants to all shared nodes
//- the scopes of these nodes are closed,
//  which is why they can be removed
//- the new last node of 'rp' will be
//  the parent to ce(sCur)
function reduceRp(sOld, sCur, rp) {
  //- E(rp) must still be equal to 'sOld'
  util.assert(rp.length == sOld.size);

  //- count the number of shared nodes
  let pLen = 0;

  for(let e of sOld) {
    if(sCur.has(e)) pLen++;
  }

  //- reduce E(rp) to the common subset
  while(rp.length > pLen) {
    rp.pop();
  }

  //- 'sCur' must now have one node on
  //  top of those in the shared subset
  util.assert(pLen == sCur.size-1);
  util.assert(pLen == rp.length);
  return pLen;
}

//========//========//========//========//========

//- both reversed scopes must have a shared subset
//- sCur must have only one characteristic element CE
//- in addition to those it shares with sOld
function getCeRef(sOld, sCur) {
  let ce=null, num=0;

  for(let e of sCur) {
    //- if 'e' is in sOld, then 'e' is
    //  an ancestor to the current node
    if(sOld.has(e)) continue;
    //- otherwise, 'e' is the CE of sCur
    ce=e, num++;
  }

  //- error if not exactly one CE
  util.assert(num == 1);
  return ce;
}
