
import * as util from "./lib/util.js"
import cNode from "./lib/cNode.js"
import cQueue from "./lib/cQueue.js"
import * as encPar from "./lib/encode/encPar.js"
import * as encLvl from "./lib/encode/encLvl.js"
import * as encLen from "./lib/encode/encLen.js"
import * as encEnd from "./lib/encode/encEnd.js"
import * as isoLenLvl from "./lib/isoLenLvl.js"

// default pre-order (PRE)                              a
// -------------------------------------------   ---------------
// a  b  c  d  e  f  g  h  i - n, trace           b    c      h
// 1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
// x  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
// 1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
// 9  1  5  1  3  1  1  2  1 - len, node.len           f   g
// 9  2  7  4  7  6  7  9  9 - lst, node.lst

try {
  //- create the initial node tree
  let n = "A,B,C,D,E,F,G,H,I".split(",");
  let par = [0,1,1,3,3,5,5,1,8];
  let root = encPar.decodePRE(n, par)[0];
  let ret = null;

  ret = encLen.encodePREv2(root);
  console.log(ret.len);

  //console.log("convert: lvl -> len");
  //root = testConvLvlToLen(root);

  //console.log("convert: len -> lvl");
  //root = testConvLenToLvl(root);

  //- x  1  1  3  3  5  5  1  8 - par
  console.log("verify the tree");
  ret = encPar.encodePRE(root);
  console.log("par-", ret.par);

  //- done, halt
  debugger;
} catch(error) {
  console.log(error);
  console.log(error.stack);
  debugger;
}

//========//========//========//========//========
//- (Hlen -> Hlvl)

function testConvLenToLvl(root) {
  let ret = null;

  //- create the length-based encoding
  //- 9  1  5  1  3  1  1  2  1 - len
  ret = encLen.encodePRE(root);
  console.log("len-", ret.len);

  //- convert to a level-based encoding
  //- 1  2  2  3  3  4  4  2  3 - lvl
  ret = isoLenLvl.convLenToLvl(ret.n, ret.len);
  console.log("lvl-", ret.lvl);

  //- decode the level-based encoding
  root = encLvl.decodePRE(ret.n, ret.lvl)[0];

  //- return the decoded tree
  return root;
}

//========//========//========//========//========
//- (Hlvl -> Hlen)

function testConvLvlToLen(root) {
  let ret = null;

  //- create the level-based encoding
  //- 1  2  2  3  3  4  4  2  3 - lvl
  ret = encLvl.encodePRE(root);
  console.log("lvl-", ret.lvl);

  //- convert to a length-based encoding
  //- 9  1  5  1  3  1  1  2  1 - len
  ret = isoLenLvl.convLvlToLen(ret.n, ret.lvl);
  console.log("len-", ret.len);

  //- decode the length-based encoding
  root = encLen.decodePRE(ret.n, ret.len)[0];

  //- return the decoded tree
  return root;
}
