its a drawing bot for the pictionary game skribbl.io

skribblio bots are really satisfying to watch so I made my own for fun. I started with python just to try it out and it worked ok. It was really janky though. So I decided to start from scratch and make it a chrome extension.

from the beginning:
First I copied all the other bots by drawing line by line. This was really slow though. I tried several color distance algorithms to choose the closet color but they were all slow, so one day I decided to store the closest color for each rgb value in a file and it was faster after that (probably not the smartest way? but it works).

But it was still slow, so I changed my approach and drew only the contours of the image and filled in the rest with the fill tool. This worked surprisingly well and some people even thought I was acutally drawing which wassn't my intention. I dont't think any other bot does it either, so I'm kind of proud :).
I used opencv to find the countours because I had it installed and knew how to use it. It's a really big library though and not ideal. I'll change it eventaully.

At this time I was still using python and drawing by moving my cursor, which was a problem. Also, I lose control of my mouse when it draws. If anything lagged, the drawing would look weird too. So I turned it into a chrome extension which draws using websockets.

Its much better now, with the search built in and everything is easy to use. Its also faster. While I was testing the site's websockets, I found out that there is actually a maximum speed for any bot. The site can only take so many directions in one drawing command before it boots you from the game, and it only processes drawing command at a fixed rate. So now my bot is the theoretical fastest.

I haven't had time to finish the extension yet, but i just have to implement what i did in python in the extension, since I'm still happy with the draw contours + fill the rest approach.
In the future if I can get the bot to draw fast enough, maybe i'll go for "subpixel rendering" (lol) where i get more resolution that the smallest brush size allows by overlapping lines. That probably wont happen though, since I think i've already hit the speed limit and it's still the bottleneck.

its fun and i got to learn javascript

i'm just dumping projects to github right now

12/20/20
