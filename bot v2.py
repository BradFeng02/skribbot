from pynput.mouse import Button,Controller
from cv2 import *
import time
import numpy as np

#def colors
white=(0xff,0xff,0xff)
gray=(0xc1,0xc1,0xc1)
red=(0xef,0x13,0x0b)
orange=(0xff,0x71,0x00)
yellow=(0xff,0xe4,0x00)
green=(0x00,0xcc,0x00)
blue=(0x00,0xb2,0xff)
purp=(0x23,0x1f,0xd3)
mag=(0xa3,0x00,0xba)
pink=(0xd3,0x7c,0xaa)
brown=(0xa0,0x52,0x2d)
black=(0x00,0x00,0x00)
dgray=(0x4c,0x4c,0x4c)
dred=(0x74,0x0b,0x07)
dorange=(0xc2,0x38,0x00)
dyellow=(0xe8,0xa2,0x00)
dgreen=(0x00,0x55,0x10)
dblue=(0x00,0x56,0x9e)
dpurp=(0x0e,0x08,0x65)
dmag=(0x55,0x00,0x69)
dpink=(0xa7,0x55,0x74)
dbrown=(0x63,0x30,0x0d)
colors=np.array([white,gray,red,orange,yellow,green,blue,purp,mag,pink,brown,black,dgray,dred,dorange,dyellow,dgreen,dblue,dpurp,dmag,dpink,dbrown])
colordx=np.array([252, 312, 369, 429, 489, 547, 609, 672, 729, 789, 855, 252, 312, 369, 429, 489, 547, 609, 672, 729, 789, 855])
colordy=np.array([1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623])

#closest color
def bestColor(col): #col is tuple (b,g,r)
    minE = euc_col_dist(col,colors[0])
    bestCol=0
    for i in range(1,22):
        E=euc_col_dist(col,colors[i])
        if E<minE:
            minE=E
            bestCol=i
    return bestCol
def euc_col_dist(BGRcol,RGBcol):
    return (BGRcol[0]-RGBcol[2])*(BGRcol[0]-RGBcol[2])+(BGRcol[1]-RGBcol[1])*(BGRcol[1]-RGBcol[1])+(BGRcol[2]-RGBcol[0])*(BGRcol[2]-RGBcol[0])


#stuff
mouse=Controller()
psize=5
canvasw=167 #255
canvash=125 #191
canvasr=canvash/canvasw
upleft=(713,406)
pen=(947,1599)
fill=(1217,1599)

#shape pic
files=os.listdir("C:\\Users\\brad\\Desktop\\skribblio bot\\image")
img=imread("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0])
h,w,_=img.shape
r=h/w
if (r>canvasr):
    img=resize(img,(int(canvash/r),canvash))
else:
    img=resize(img,(canvasw,int(canvasw*r)))
h,w,_=img.shape

#create draw matrix
drawMat=np.zeros((h,w))
print(w,h,drawMat.shape[0],drawMat.shape[1])
for x in range(w):
    for y in range(h):
        # bestColor(img[y,x])
        drawMat[y,x]=bestColor(img[y,x])
fillMat=np.copy(drawMat)
imshow("test",img)
waitKey()
cv2.destroyAllWindows()

#edge of color
def isEdge(y,x,c):
    return y-1<0 or drawMat[y-1,x]!=c or y+1>=h or drawMat[y+1,x]!=c or x-1<0 or drawMat[y,x-1]!=c or x+1>=w or drawMat[y,x+1]!=c
def isEdge2(y,x,c):
    return (y-1<0 or fillMat[y-1,x]!=c) and (x-1<0 or fillMat[y,x-1]!=c)

#draw
for c in range(1,22):
    mouse.position=(upleft[0]+colordx[c],upleft[1]+colordy[c])
    mouse.click(Button.left,1)
    mouse.position=(upleft[0]+pen[0],upleft[1]+pen[1])
    mouse.click(Button.left,1)
    for x in range(w):
        for y in range(h):
            if drawMat[y,x]==c and isEdge(y,x,c):
                mouse.position=(upleft[0]+psize*x,upleft[1]+psize*y)
                mouse.click(Button.left,1)
                fillMat[y,x]=-1
    mouse.position=(upleft[0]+fill[0],upleft[1]+fill[1])
    mouse.click(Button.left,1)
    for x in range(w):
        for y in range(h):
            if fillMat[y,x]==c and isEdge2(y,x,c):
                mouse.position=(upleft[0]+psize*x,upleft[1]+psize*y)
                mouse.click(Button.left,1)

print("done")

# test draw
# mouse.position=upleft
# for i in range(10):
#     mouse.press(Button.left)
#     # time.sleep(1)
#     mouse.move(100,0)
#     time.sleep(.05)
#     mouse.release(Button.left)
#     # time.sleep(1)
#     mouse.move(-100,5)
    

