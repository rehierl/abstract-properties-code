
The following source code is intended to provide a deeper understanding of
the level- and the length-based encodings by comparing these with their more
explicit counterparts such as a hierarchy of rooted paths. This approach allows
to show a stepwise refinement of how these encodings can be implemented.

Note that all sequences in this context are ordered and expected to be ordered
according to the pre-order tree traversal.

```
Hrp <-> Hrs <-> Hlvl
|<-------DT------->|
```

Recall that a hierarchy of rooted paths (Hrp) is isomorphic to a hierarchy of
reversed scopes (Hrs) and isomorphic to a hierarchy of level values (Hlvl).

```
Hpre <-> Hs <-> Hlen
|<-------DT------->|
```

Recall that a hierarchy of pre-order traces (Hpre) is isomorphic to a hierarchy
of scopes (Hs) and isomorphic to a hierarchy of length values (Hlen).

```
Hlvl <--> Hlen
|<----DT---->|
```

Note that, since a document tree is isomorphic to all of these hierarchies, a
hierarchy of level values can be described to be isomorphic to a hierarchy of
length values. That is, one can be transformed into the other more or less
efficiently.
