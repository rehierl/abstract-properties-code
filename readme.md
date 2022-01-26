
This repository is in regards to the **abstract properties** repository.

* The source code is partially contained in **chapter 17**.
* This repository proofs that the concept of scopes does work.

Note that the source code in this repository can be executed using the
[Visual Studio Code](https://code.visualstudio.com/)
lightweight IDE, or some alternative IDE such as
[NetBeans](https://netbeans.apache.org/),
which can be configured to run
[Node](https://nodejs.org/en/)
based projects.

The source code in the **/encodings** subfolder allows to encode and
decode a document tree into and from simple sequences of numeric values.

* par - the parent-based explicit encoding
* lvl - the level-based implicit encoding
* len - the length-based implicit encoding
* end - the end-/first-/last-based encoding

Note that the level-based encoding of a docment tree is in essence a sequence
of node levels. Similar to that, the length-based encoding of a document tree
is a sequence of node counts such that each value refers to the number of nodes
in the corresponding induced subtree.

Note that the end-/first-/last-based encodings are specialized level-based
encodings. Because of that, these encodings don't add anything substantial
other than these can be read/written more efficiently than the level-based
encoding.

The source code in the **/isomorphisms** subfolder is intended to provide a
deeper understanding of the level- and the length-based encodings by forming
these from their explicit counterparts, such as a hierarchy of rooted paths.
This approach allows to show a stepwise refinement of how the these encodings
can be implemented.

Note that the source code in this subfolder only focuses on the pre-order
tree traversal of the following document tree.

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

Note that the word **isomorphism** in this context is used to denote that
**two structures can be transformed into each other**, while maintaining all
the information each structure holds. The focus in this context is however
on the structure of a document tree, described in terms of node references
(r) and edges, not so much on the actual node definitions (n).

```
Hrp <-> Hrs <-> DT <-> Hs <-> Hpre
|<---- Hlvl --->||<--- Hlen ---->|
```

A document tree (DT) is isomorphic to a hierarchy of rooted paths (Hrp),
isomorphic to a hierarchy of reversed scopes (Hrs), and isomorphic to a
hierarchy of level values (Hlvl). Also, a document tree (DT) is isomorphic
to a hierarchy of pre-order traces (Hpre), isomorphic to a hierarchy of
scopes (Hs), and isomorphic to a hierarchy of length values (Hlen).

Note that Hrs and Hs are both families of sets of nodes, each of which
has specific characterisitcs. The only difference is that Hrs is formed by
replacing each rooted path in Hrp by the set of nodes it holds, while Hs
is formed by replacing each pre-order trace by the set of nodes in the
corresponding induced subtree.

Note that Hlen and Hlvl both hold one node count for each set in the
corresponding hierarchy. In combination with a particular trace of nodes
(i.e. a particular tree traversal), each sequence of node counts can be
understood to completely define the structure of the corresponding tree.

```
Hlvl <--> Hlen
|<--> DT <-->|
```

As a matter of consequence, a hierarchy/sequence of level values (i.e. the
tree's level-based encoding) is isomorphic to the document tree's hierarchy
of length values (i.e. the tree's length-based encoding).

Note that Hlvl and Hlen can both be transformed into each other, without
having to first decode the entire document tree. That is, Hlen can be formed
from Hlvl on the fly, and vice versa.

Note that, to some extent, **Hlvl can be described as being dual to Hlen**.
