
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hs - a hierarchy of (default) scopes
//########//########//########//########//########
//========//========//========//========//========

export function encodeHs(root) {
  let n=[], hs=[], rp=[];

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    let scope = new Set();
    rp.push(scope);

    //- visit the current node
    n.push(node.def());
    node.ref = n.length;
    hs.push(null);

    //- append the node reference to each
    //  scope in the current rooted path
    for(let scope of rp) {
      scope.add(node.ref);
    }

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- exit the node's type-1 scope
    scope = rp.pop();
    hs[node.ref-1] = scope;
  }

  visitPreFTL(root);
  return { n, hs };
}

//########//########//########//########//########
//========//========//========//========//========

export function decodeHs(n, hs) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == hs.length);
  let all = hs[0];//- the root's scope
  util.assert(all.size == len);
  let nodes=[], roots=[];
  let rp=[], sCur;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    current.ref = (i+1);
    nodes.push(current);

    //- sCur must have the current node
    //  as its characteristic element CE
    sCur = hs[i];
    util.assert(sCur.size > 0);
    util.assert(sCur.has(i+1));
    current.scope = sCur;

    //- reduce the rooted path
    let pLen = reduceRp(sCur, rp);

    //- if the node is a root
    if(pLen == 0) {
      rp.push(current);
      roots.push(current);
      continue;
    }

    //- the current node is a child to the
    //  last node in the rooted path
    let parent = rp[pLen-1];
    parent.addAsLastChild(current);
    rp.push(current);
  }

  util.assert(roots.length == 1);
  return roots[0];
}

//========//========//========//========//========

//- reduce the rooted path 'rp' to the scope
//  that holds the first super-scope of sCur
//- sCur is a root, if there is no node with
//  such a scope already in the rooted path
//- in the former case, the rooted path will
//  end with the current node's parent
//- in the latter case, the rooted path will
//  be cleared of all entries
function reduceRp(sCur, rp) {
  while(true) {
    //- the current node is a root,
    //  if the rooted path is empty
    let len = rp.length;
    if(len == 0) return 0;

    //- test if the current last node
    //  is the current node's parent
    //- sCur must be a subset to sPar
    let parent = rp[len-1];
    let sPar = parent.scope;
    let result = isSubsetOf(sPar, sCur);

    //- if yes, then that last node
    //  is the current node's parent
    if(result == true) return len;

    //- if not, then the scope of that last
    //  node has ended - hence, pop that node
    rp.pop();
  }
}

//========//========//========//========//========

//- returns true, only if set2 is a subset to set1
function isSubsetOf(set1, set2) {
  let n1 = set1.size;
  let n2 = set2.size;
  util.assert(n2 > 0);
  if(n2 >= n1) return false;

  for(let e of set2) {
    if(set1.has(e)) continue;
    return false;
  }

  return true;
}
