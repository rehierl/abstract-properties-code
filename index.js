
import * as encPar from "./lib/encodings/enc1-Par.js"
import * as testEnc from "./lib/encodings/testEnc.js"
import * as testIso from "./lib/isomorphisms/testIso.js"

// default pre-order (PRE)                              a
// -------------------------------------------   ---------------
// a  b  c  d  e  f  g  h  i - n, trace           b    c      h
// 1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
// 0  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
// 1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
// 9  1  5  1  3  1  1  2  1 - len, node.len           f   g
// 9  2  7  4  7  6  7  9  9 - lst, node.lst

try {
  //- create the initial node tree
  let n = "A,B,C,D,E,F,G,H,I".split(",");
  let par = [0,1,1,3,3,5,5,1,8];
  let root = encPar.decodePRE(n, par);
  encPar.debugPRE(root);

  //- test the encodings
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
