
This repository is in regards to the **abstract-properties** repository.

* The source code is partially contained in **chapter 17**.
* This repository suggests that the concept of scopes does work.

Note that the source code in this repository can be executed using the
[Visual Studio Code](https://code.visualstudio.com/)
lightweight IDE, or some alternative IDE such as
[NetBeans](https://netbeans.apache.org/),
which can be configured to run
[Node](https://nodejs.org/en/)
based projects.

The source code in the **/lib/encodings** subfolder allows to encode and
decode a document tree into and from simple sequences of numeric values.

* par - the parent-based explicit encoding
* lvl - the level-based implicit encoding
* len - the length-based implicit encoding
* end - the end-/first-/last-based encoding

Note that the level-based encoding of a document tree is in essence a sequence
of node levels. Similar to that, the length-based encoding of a document tree
is a sequence of node counts such that each value refers to the number of nodes
in the corresponding induced subtree.

Note that the end-/first-/last-based encodings are specialized length-based
encodings. Because of that, these encodings don't add anything substantial
other than that these can be read/written more efficiently.

The source code in the **/lib/isomorphisms** subfolder is intended to provide
a deeper understanding of the level- and the length-based encodings by forming
these from their explicit counterparts, such as an explicit hierarchy of rooted
paths. This approach allows to show a stepwise refinement of how the these
encodings can be implemented.

Note that the source code in this subfolder only focuses on the pre-order
tree traversal of the following document tree. Hence, this repository is
only intended to show that the overall concept of abstract properties can
be implemented.

```
default pre-order (PRE)                              a
-------------------------------------------   ---------------
a  b  c  d  e  f  g  h  i - n, trace           b    c      h
1  2  3  4  5  6  7  8  9 - r, node.idx           -----   ---
0  1  1  3  3  5  5  1  8 - par, parent.idx       d   e    i
1  2  2  3  3  4  4  2  3 - lvl, node.lvl           -----
9  1  5  1  3  1  1  2  1 - len, node.len           f   g
9  2  7  4  7  6  7  9  9 - lst, node.lst
```

Note that the word **isomorphism** is at this point only used to denote that
**two structures can be transformed into one another**, while maintaining all
the information each structure holds. The focus in this context is however on
the structure of a document tree, described in terms of node references (r)
and edges, not on the sequence of node definitions (n). The latter is in
general only assumed to exist one way or another.

```
Hrp <-> Hrs <-> DT <-> Hs <-> Hpre
|<---- Hlvl --->||<--- Hlen ---->|
```

A document tree (DT) is isomorphic to a hierarchy of rooted paths (Hrp),
isomorphic to a hierarchy of reversed scopes (Hrs), and isomorphic to a
hierarchy of level values (Hlvl). Also, a document tree (DT) is isomorphic
to a hierarchy of pre-order traces (Hpre), isomorphic to a hierarchy of
scopes (Hs), and isomorphic to a hierarchy of length values (Hlen).

* see [DT-Hlvl.js](./lib/isomorphisms/iso-1-2-DT-Hlvl.js)
  and [DT-Hlen.js](./lib/isomorphisms/iso-2-2-DT-Hlen.js)

Note that Hrs and Hs are both families of sets of nodes, each of which has
specific characteristics. The most important difference is that Hrs is formed
by replacing each rooted path in Hrp by the set of nodes it holds, while Hs
is formed by replacing each pre-order trace by the set of nodes in the
corresponding induced subtree.

Note that Hlen and Hlvl are both (!) sequences of node counts which hold one
node count for each set in the corresponding hierarchy. In combination with
a particular trace of nodes (i.e. a particular tree traversal), each sequence
of node counts can be understood to embed a comple definiton the structure of
the corresponding tree.

```
Hlvl <--> Hlen
|<--> DT <-->|
```

As a matter of consequence, a hierarchy/sequence of level values (i.e. the
tree's level-based encoding) is isomorphic to the document tree's hierarchy
of length values (i.e. the tree's length-based encoding). That is, Hlvl and
Hlen can both be transformed into one another, without having to first decode
the entire document tree. To be more accurate, Hlen can be formed on the fly
while decoding Hlvl, and vice versa.

* see [Hlen-Hlvl.js](./lib/isomorphisms/iso-3-0-Hlen-Hlvl.js)

Note that, to some extent, **Hlvl can be described as being dual to Hlen**.
