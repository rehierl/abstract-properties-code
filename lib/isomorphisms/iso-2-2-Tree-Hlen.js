
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hlen - a hierarchy of length values
//- the pre-order versions of the length-based encoding
//########//########//########//########//########
//========//========//========//========//========

//- (Tree -> Hlen)
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

//########//########//########//########//########
//========//========//========//========//========

//- (Hlen -> Tree)
//- assuming `n` is in pre-order
export function decodeHlen(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- root
  util.assert(len[num-1] == 1);//- leaf
  let nodes=[], roots=[], rp=[];

  for(let i=0; i<num; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    current.iFirst = i;//- the offset
    nodes.push(current);

    let count = len[i];
    util.assert(count > 0);
    current.iCount = count;

    let iLast = (i + count - 1);
    current.iLast = iLast;
    let level = rp.length;

    if(level == 0) {
      roots.push(current);
      rp.push(current);
      continue;
    }

    if(level > 0) {
      let parent = rp[level-1];
      //- recall the DI-RE case for scopes
      util.assert(iLast <= parent.iLast);
      parent.addAsLastChild(current);
    }

    rp.push(current);

    //- reduce the rooted path
    reduceRp(i, rp);
  }

  util.assert(rp.length == 0);
  util.assert(roots.length == 1);
  return roots[0];
}

//========//========//========//========//========

function reduceRp(i, rp) {
  for(let j=rp.length-1; j>=0; j--) {
    let node = rp[j];
    //- the node's scope has not been
    //  exited yet - i.e. not yet done
    if(node.iLast > i) break;
    rp.pop();
  }
}
