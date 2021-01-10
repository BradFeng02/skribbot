//opencv
var s = document.createElement('script');
s.src = chrome.runtime.getURL('opencv.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

//best colors
var s = document.createElement('script');
s.src = chrome.runtime.getURL('best_colors.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

//image search
var s = document.createElement('script');
s.src = "https://cse.google.com/cse.js?cx=010962155545011406048:l8fbnmfxa-o";
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

//image search
var s = document.createElement('script');
s.src = chrome.runtime.getURL('bot.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);