

This was a small quarantine project so I didn't really care about how hacky and delicate everything was at the time

copied from master readme:

First I copied all the other bots by drawing line by line. This was really slow though. I tried several color distance algorithms to choose the closet color but they were all slow, so one day I decided to store the closest color for each rgb value in a file and it was faster after that (probably not the smartest way? but it works).

But it was still slow, so I changed my approach and drew only the contours of the image and filled in the rest with the fill tool. This worked surprisingly well and some people even thought I was acutally drawing which wassn't my intention. I dont't think any other bot does it either, so I'm kind of proud :). I used opencv to find the countours because I had it installed and knew how to use it. It's a really big library though and not ideal. I'll change it eventaully.

At this time I was still using python and drawing by moving my cursor, which was a problem. Also, I lose control of my mouse when it draws. If anything lagged, the drawing would look weird too.
