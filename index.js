
import * as util from "./lib/util.js"
import cNode from "./lib/cNode.js"
import cQueue from "./lib/cQueue.js"

//- encoding/decoding
import * as encPar from "./lib/encodings/enc1-Par.js"
import * as testEnc from "./lib/encodings/testEnc.js"

//- transformations
import * as testIso from "./lib/isomorphisms/testIso.js"

// default pre-order (PRE)                              a
// -------------------------------------------   ---------------
// a  b  c  d  e  f  g  h  i - n, trace           b    c      h
// 1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
// 0  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
// 1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
// 9  1  5  1  3  1  1  2  1 - len, node.len           f   g
// 9  2  7  4  7  6  7  9  9 - lst, node.lst
//- ------------------------------------------
//-                f  g       - lv4
//-          d  e  e  e     i - lv3
//-    b  c  c  c  c  c  h  h - lv2
//- a  a  a  a  a  a  a  a  a - lv1

try {
  //- create the initial node tree
  let n = "A,B,C,D,E,F,G,H,I".split(",");
  let par = [0,1,1,3,3,5,5,1,8];
  let root = encPar.decodePRE(n, par);
  encPar.debugPRE(root);

  //- test all encodings
  //testEnc.run(root);

  //- test the isomorphisms
  testIso.run(root);

  //- done, halt
  debugger;
} catch(error) {
  console.log(error);
  console.log(error.stack);
  debugger;
}
