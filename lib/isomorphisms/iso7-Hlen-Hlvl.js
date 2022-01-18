
//- this is THE ORIGINAL version (!)
import * as util from "../util.js"

//- transform Hlen to Hlvl and vice versa
//- i.e. re-encode a level-based encoding as
//  a length-based encoding, and vice versa
//########//########//########//########//########
//========//========//========//========//========

export function convLenToLvl(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- root
  util.assert(len[num-1] == 1);//- leaf
  let i=0, lvl=[], rp=[];

  //- read len[] and write lvl[]
  for(i=0; i<num; i++) {
    let count = len[i];
    util.assert(count > 0);

    //- push the current length as a child
    //- rp.push() returns rp.length after the update
    let current = { i: i, key: n[i],
      count: count, remaining: count };
    let level = rp.push(current);
    lvl[i] = level;

    if(level > 1) {//- has a parent
      let parent = rp[level-1];
      util.assert(count <= parent.remaining);
    }

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
  return { n, lvl };
}

//========//========//========//========//========

export function convLvlToLen(n, lvl) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == lvl.length);
  util.assert(lvl[0] == 1);//- root
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
    let level = lvl[i];
    util.assert(level > 0);

    //- reduce the rooted path
    reduceRP(level);

    //- push the current level as a child
    util.assert(rp.length == level-1);
    rp.push({ i, key: n[i], lvl: level, len: 1 });
  }

  reduceRP(1);//- reduce rp to level zero
  util.assert(rp.length == 0);
  return { n, len };
}
