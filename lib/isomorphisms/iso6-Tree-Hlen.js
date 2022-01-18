
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hlen - a hierarchy of length values
//- the pre-order versions of the length-based encoding
//########//########//########//########//########
//========//========//========//========//========

export function encodeHlen(root) {
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

//- assuming `n` is in pre-order
export function decodeHlen(n, len) {
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
    let level = rp.length;

    if(level == 0) {
      roots.push(current);
    }

    if(level > 0) {
      let parent = rp[level-1];
      util.assert(count <= parent.remaining);
      parent.addAsLastChild(current);
    }

    rp.push(current);
    level = rp.length;

    //- first, reduce all node counts
    for(let i=0; i<level; i++) {
      rp[i].remaining--;
    }

    //- then, pop entries if necessary
    for(let i=level-1; i>=0; i--) {
      if(rp[i].remaining > 0) break;
      rp.pop();
    }
  }

  util.assert(rp.length == 0);
  util.assert(roots.length == 1);
  return roots[0];
}
