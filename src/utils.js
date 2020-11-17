Object.deepCompare = (o1, o2) =>
    typeof o1 === 'object' && Object.keys(o1).length > 0 ?
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every(p => objectsEqual(o1[p], o2[p])) :
    o1 === o2;

Array.equals = (a1, a2) =>
	a1 instanceof Array && a2 instanceof Array && a1.length === a2.length && a1.every((o, idx) => Object.deepCompare(o, a2[idx]))
