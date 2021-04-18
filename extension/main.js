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

//bot
var s = document.createElement('script');
s.src = chrome.runtime.getURL('bot.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);