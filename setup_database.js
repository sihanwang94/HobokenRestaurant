#!/usr/bin/mongo --quiet
load('./data/data.js');

// display letters

for (i in originaldata) {
  var doc  = originaldata[i];
  print(doc.letter);
}