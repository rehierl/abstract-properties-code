
import * as util from "../util.js"

//- transform Hlen to Hlvl, and vice versa
//- i.e. re-encode a level-based encoding as
//  a length-based encoding, and vice versa
//########//########//########//########//########
//========//========//========//========//========

//- (Hlen -> Hlvl)
export function convLenToLvl(n, len) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == len.length);
  util.assert(len[0] == num);//- root
  util.assert(len[num-1] == 1);//- leaf
  let rp=[], lvl=[];

  //- read len[], write lvl[]
  for(let i=0; i<num; i++) {
    let count = len[i];
    util.assert(count > 0);
    let iLast = (i+count-1);
    let level = rp.length;

    if(level > 0) {
      let iParent = rp[level-1];
      util.assert(iLast <= iParent);
    }

    rp.push(iLast);
    lvl.push(level+1);

    //- reduce the rooted path
    for(let j=level+1-1; j>=0; j--) {
      if(rp[j] > i) break;
      rp.pop();
    }
  }

  util.assert(rp.length == 0);
  return { n, lvl };
}

//########//########//########//########//########
//========//========//========//========//========

//- (Hlvl -> Hlen)
export function convLvlToLen(n, lvl) {
  let num = n.length;
  util.assert(0 < num);
  util.assert(num == lvl.length);
  util.assert(lvl[0] == 1);//- root
  let len=[], rp=[];

  //- read lvl[], write len[]
  for(let i=0; i<num; i++) {
    let level = lvl[i];
    util.assert(level > 0);
    len.push(0);//- init len[i]

    //- reduce the rooted path
    reduceRp(rp, level, len);

    //- push the current level as a child
    util.assert(rp.length == level-1);
    rp.push({ iFirst: i, length: 1 });
    continue;
  }

  reduceRp(rp, 1, len);//- clear
  util.assert(rp.length == 0);
  return { n, len };
}

//========//========//========//========//========

function reduceRp(rp, level, len) {
  let length = rp.length;

  while(length >= level) {
    let node = rp.pop();
    len[node.iFirst] = node.length;

    length = (length - 1);
    if(length == 0) break;

    //- the current node has a parent
    let parent = rp[length-1];
    parent.length += node.length;
  }
}
