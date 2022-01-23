
import * as util from "../util.js"
import cNode from "../cNode.js"

//- Hpre - a hierarchy of pre-order traces
//########//########//########//########//########
//========//========//========//========//========

//- returns a pre-order trace of pre-order traces
//- each trace in the hierarchy of traces "hpre" is the
//  pre-order trace of the corresponding node in "n"
export function encodeHpre(root) {
  let n=[], hpre=[], rp=[];

  function visitPreFTL(node) {
    //- enter the node's type-1 scope
    let trace = new Array();
    rp.push(trace);

    //- visit the current node
    n.push(node.def());
    node.ref = n.length;
    hpre.push(null);

    //- append the node reference to each
    //  trace in the current rooted path
    for(let trace of rp) {
      trace.push(node.ref);
    }

    //- visit the child nodes
    for(let child of node.childNodesFTL) {
      visitPreFTL(child);
    }

    //- exit the node's type-1 scope
    trace = rp.pop();
    hpre[node.ref-1] = trace;
  }

  visitPreFTL(root);
  return { n, hpre };
}

//########//########//########//########//########
//========//========//========//========//========

export function decodeHpre(n, hpre) {
  let len = n.length;
  util.assert(0 < len);
  util.assert(len == hpre.length);
  let pre = hpre[0];//- the root's trace
  util.assert(pre.length == len);
  util.assert(pre[0] == 1);//- the root
  let nodes=[], roots=[];
  let rp=[], tCur;

  for(let i=0; i<len; i++) {//- i in [0,#n)
    let current = new cNode(n[i]);
    current.ref = (i+1);
    nodes.push(current);

    //- tCur must have the current node
    //  as its characteristic element CE
    //- as its first element
    tCur = hpre[i];
    util.assert(tCur.length > 0);
    util.assert(tCur[0] == (i+1));
    current.trace = tCur;

    //- reduce the rooted path
    let pLen = reduceRp(tCur, rp);

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

//- reduce the rooted path 'rp' to the node
//  that holds the first super-trace of tCur
//- tCur is a root, if there is no node with
//  such a trace already in the rooted path
//- in the former case, the rooted path will
//  end with the current node's parent
//- in the latter case, the rooted path will
//  be cleared of all entries
function reduceRp(tCur, rp) {
  while(true) {
    //- the current node is a root,
    //  if the rooted path is empty
    let len = rp.length;
    if(len == 0) return 0;

    //- test if the current last node is
    //  an ancestor to the current node
    //- tCur must be a substring to tPar
    let parent = rp[len-1];
    let tPar = parent.trace;
    let offset = indexOf(tPar, tCur);

    //- if yes, then that last node
    //  is the current node's parent
    if(offset > 0) return len;

    //- if not, then the scope of that last
    //  node has ended - hence, pop that node
    rp.pop();
  }
}

//========//========//========//========//========

//- returns the offset of trace2 in trace1,
//  only if trace2 is a substring to trace1
function indexOf(trace1, trace2) {
  let len1 = trace1.length;
  let len2 = trace2.length;
  util.assert(len2 > 0);
  if(len2 >= len1) return -1;
  let offset = 0;

  {//- find the first entry of t2 in t1
    let i=0, n2=trace2[0];

    while(i < len1) {
      let ni = trace1[i];
      if(ni == n2) break;
      i++;
    }

    if(i >= len1) return -1;
    offset = i;
  }

  {//- verify that t2 is a substring to t1
    let i=offset, iMax=(i+len2-1), j=0;
    util.assert(iMax < len1);//- no overlap

    while(i <= iMax) {
      let n1 = trace1[i++];
      let n2 = trace2[j++];
      if(n1 != n2) return -1;
    }
  }

  //- the first element must be unique
  util.assert(offset > 0);
  return offset;
}
