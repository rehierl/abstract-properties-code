
//- this is THE ORIGINAL version (!)
import * as util from "./util.js"

//- re-encode a level-based encoding as
//  a length-based encoding, and vice versa
//- only in regards to the pre-order traversal
//########//########//########//########//########
//========//========//========//========//========

//- default pre-order (PRE)                              a
//- -------------------------------------------   ---------------
//- a  b  c  d  e  f  g  h  i - n, trace           b    c      h
//- 1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
//- x  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
//- 1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
//- 9  1  5  1  3  1  1  2  1 - len, node.len           f   g
//- -------------------------------------------
//-                f  g       - lv4
//-          d  e  e  e     i - lv3
//-    b  c  c  c  c  c  h  h - lv2
//- a  a  a  a  a  a  a  a  a - lv1

//========//========//========//========//========

export function convLenToLvl(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- root
  util.assert(len[num-1] == 1);//- leaf
  //- rp is a rooted path of entries
  //- entry.i - the node's offset in n/len/lvl
  //- entry.key - n[i]
  //- entry.len - len[i]
  //- entry.rem - a remaining node count
  let i=0, lvl=[], rp=[];

  //- update the rooted path
  //- pop all entries that have
  //  a remaining count of 0/zero
  //- compare the cPathLen class
  function reduceRP() {
    while(true) {
      let lv = rp.length;
      if(lv == 0) break;

      let c = rp[lv-1];
      if(c.rem > 0) break;

      if(lv > 1) {//- has a parent
        let p = rp[lv-2];
        p.rem = p.rem - c.len;
      }

      rp.pop();
    }//- while
  }//- reduce()

  //- read len[] and write lvl[]
  for(i=0; i<num; i++) {
    let ln = len[i];
    util.assert(ln > 0);

    //- push the current length as a child
    //- rp.push() returns rp.length after the update
    let c = { i, key: n[i], len: ln, rem: ln};
    let lv = rp.push(c);
    lvl[i] = lv;

    if(lv > 1) {//- has a parent
      let p = rp[lv-2];
      //- verify the DI-RE case
      util.assert(c.len <= p.rem);
    }

    //- reduce the topmost entry by one
    c.rem = c.rem - 1
    if(c.rem > 0) continue;

    //- reduce the rooted path
    reduceRP();
  }

  util.assert(rp.length == 0);
  return { n, lvl };
}

//========//========//========//========//========

export function convLvlToLen(n, lvl) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == lvl.length);
  util.assert(lvl[0] == 1);//- root
  //- rp is a rooted path of entries
  //- entry.i - its offset in n/lvl/len
  //- entry.key - n[i]
  //- entry.lvl - lvl[i]
  //- entry.len - len[i]
  let i=0, len=[], rp=[];

  //- reduce the rp[] in length such that
  //  lvl[i] is the level of the node that
  //  is appended next
  //- first reduce rp to a parent
  //- then push the next level as a child
  function reduceRP(level) {
    util.assert(level >= 1);
    let lv = rp.length;
    if(lv < level) return;

    while(lv >= level) {
      let c = rp.pop();//- child
      len[c.i] = c.len;
      lv = (lv - 1);

      if(lv == 0) break;
      let p = rp[lv-1];//- parent
      p.len += c.len;
    }
  }//- reduce()

  //- read lvl[] and write len[]
  for(i=0; i<num; i++) {
    let lv = lvl[i];
    util.assert(lv > 0);
    reduceRP(lv);

    //- push the current level as a child
    util.assert(rp.length == lv-1);
    rp.push({ i, key: n[i], lvl: lv, len: 1 });
  }

  reduceRP(1);//- reduce rp to length/level 0/zero
  util.assert(rp.length == 0);
  return { n, len };
}
