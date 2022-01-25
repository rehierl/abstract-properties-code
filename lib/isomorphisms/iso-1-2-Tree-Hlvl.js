
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hlvl - a hierarchy of level values
//- the pre-order versions of the level-based encoding
//########//########//########//########//########
//========//========//========//========//========

//- (Tree -> Hlvl)
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

//########//########//########//########//########
//========//========//========//========//========

//- (Hlvl -> Tree)
//- assuming `n` is in pre-order
export function decodeHlvl(n, lvl) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == lvl.length);
  util.assert(lvl[0] == 1);//- a root
  let nodes=[], roots=[];
  let rp=[], level, last;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let node = new cNode(n[i]);
    nodes.push(node);

    level = lvl[i];
    util.assert(level >= 1);
    node.lvl = level;

    //- if the node is a root
    if(level == 1) {
      roots.push(node);
      util.assert(rp.length == 0);
      rp.push(node);
      last = level;
      continue;
    }

    //- the input level must not exceed
    //  the valid range [1,#rp+1]
    util.assert(level <= rp.length+1);

    //- reduce rp to the shared prefix
    let pLen = reduceRp(last, level, rp);

    //- the node is a child
    let parent = rp[pLen-1];
    parent.addAsLastChild(node);

    //- 'rp' is now the rooted path
    //  of the current node
    rp.push(node);
    last = level;
    continue;
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//========//========//========//========//========

function reduceRp(last, level, rp) {
  //- 'rp' is still the rooted path
  //  of the previous node
  util.assert(rp.length == last);

  //- reduce 'rp' to the shared prefix
  while(rp.length >= level) {
    rp.pop();
  }

  //- the current rooted path must now have
  //  one node on top of those in 'rp'
  util.assert(rp.length == level-1);
  return (level-1);
}
