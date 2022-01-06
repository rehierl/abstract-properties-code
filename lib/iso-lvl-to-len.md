
<!-- ======================================================================= -->
# (Hlvl -> Hlen)

```
default pre-order (PRE)                              a
-------------------------------------------   ---------------
a  b  c  d  e  f  g  h  i - n, trace           b    c      h
1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
x  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
9  1  5  1  3  1  1  2  1 - len, node.len           f   g
```

converting the level-based into the length-based encoding
- explain the Hlvl and Hlen abbreviations

<!-- ======================================================================= -->

- higher level -> a child
- same level -> a sibling to the last
- lower level -> a sibling to an ancestor

<!-- ======================================================================= -->

note - backwards oriented, one must know the next in order to know if the
previous node is done
