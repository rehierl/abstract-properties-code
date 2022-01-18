
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hlvl - a hierarchy of level values
//- the pre-order versions of the level-based encoding
//########//########//########//########//########
//========//========//========//========//========

export function encodeHlvl(root) {
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
export function decodeHlvl(n, lvl) {
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

    //- if the node is a root
    if(level == 1) {
      roots.push(node);
      rp[0] = node;
      last = level;
      continue;
    }

    //- the input level must not
    //  exceed the valid range [1,#rp+1]
    util.assert(level <= (last+1));
    rp[level-1] = node;

    //- the node is a child
    let parent = rp[level-2];
    parent.addAsLastChild(node);

    last = level;
    continue;
  }

  util.assert(roots.length == 1);
  return roots[0];
}
