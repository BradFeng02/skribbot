from pynput.mouse import Button,Controller
from cv2 import *
import time
import numpy as np
import colormath
from colormath.color_objects import LabColor
from colormath.color_diff import delta_e_cie1976
import win32gui

#def colors
white=LabColor(100,0,0)
gray=LabColor(78.07,0,0)
red=LabColor(50.51,74.74,61.34)
orange=LabColor(64.22,50.02,72.38)
yellow=LabColor(90.21,-8.44,89.46)
green=LabColor(71.68,-72.84,70.31)
blue=LabColor(68.79,-10.67,-48.43)
purp=LabColor(29.51,61.03,-87.39)
mag=LabColor(40.14,73.92,-54.76)
pink=LabColor(62.65,39.79,-9.82)
brown=LabColor(43.8,29.32,35.64)
black=LabColor(0,0,0)
dgray=LabColor(32.32,0,0)
dred=LabColor(23.57,42.58,32.35)
dorange=LabColor(44.66,53.08,56.49)
dyellow=LabColor(71.56,15.75,75.42)
dgreen=LabColor(30.72,-37.58,31.82,)
dblue=LabColor(36.22,6.93,-45.12,)
dpurp=LabColor(10.6,36.29,-51.09)
dmag=LabColor(19.85,47.78,-38.17)
dpink=LabColor(46.94,37.26,-2.11)
dbrown=LabColor(26.15,20.42,31.12)
colors=np.array([white,gray,red,orange,yellow,green,blue,purp,mag,pink,brown,black,dgray,dred,dorange,dyellow,dgreen,dblue,dpurp,dmag,dpink,dbrown])
colordx=np.array([252, 312, 369, 429, 489, 547, 609, 672, 729, 789, 855, 252, 312, 369, 429, 489, 547, 609, 672, 729, 789, 855])
colordy=np.array([1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623])

#closest color
def bestColor(col): #col is colorlab obj
    minE = delta_e_cie1976(col,colors[0])
    bestCol=0
    for i in range(1,22):
        E=delta_e_cie1976(col,colors[i])
        if E<minE:
            minE=E
            bestCol=i
    return bestCol


#stuff
mouse=Controller()
psize=5
canvasw=167 #255
canvash=125 #191
canvasr=canvash/canvasw
upleft=(713,406)
pen=(947,1599)
fill=(1217,1599)
col=0

#shape pic
files=os.listdir("C:\\Users\\brad\\Desktop\\skribblio bot\\image")
imgrgb=imread("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0])
h,w,_=imgrgb.shape
r=h/w
if (r>canvasr):
    imgrgb=resize(imgrgb,(int(canvash/r),canvash))
else:
    imgrgb=resize(imgrgb,(canvasw,int(canvasw*r)))
h,w,_=imgrgb.shape
os.remove("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0])
# imshow("test",imgrgb)
# waitKey()
# cv2.destroyAllWindows()
img=cvtColor(imgrgb,COLOR_BGR2LAB)

#minimize "bot" and go to "skribblio" (rename windows)
win32gui.ShowWindow(win32gui.FindWindow(None,"bot"), 6)
win32gui.SetForegroundWindow(win32gui.FindWindow(None,"skribblio"))
time.sleep(.5)

#create draw matrix
drawMat=np.zeros((h,w))
print("one sec...")
for x in range(2):
    for y in range(h):
        if imgrgb[y,x,0]!=255 or imgrgb[y,x,1]!=255 or imgrgb[y,x,2]!=255:
            drawMat[y,x]=bestColor(LabColor(img[y,x,0]*100/255.0,img[y,x,1]-128,img[y,x,2]-128))
fillMat=np.copy(drawMat)

#edge of color
def isEdge(y,x,c):
    return y-1<0 or drawMat[y-1,x]!=c or y+1>=h or drawMat[y+1,x]!=c or x-1<0 or drawMat[y,x-1]!=c or x+1>=w or drawMat[y,x+1]!=c
def isEdge2(y,x,c):
    return (y-1<0 or fillMat[y-1,x]!=c) and (x-1<0 or fillMat[y,x-1]!=c)

#draw
mouse.position=(upleft[0]+pen[0],upleft[1]+pen[1])
mouse.click(Button.left,1)
for x in range(w):
    for c in range(1,22):
        unused=True
        for y in range(h):
            if drawMat[y,x]==c and isEdge(y,x,c):
                if unused:
                    mouse.position=(upleft[0]+colordx[c],upleft[1]+colordy[c])
                    mouse.click(Button.left,1)
                    unused=False
                mouse.position=(upleft[0]+psize*x,upleft[1]+psize*y)
                mouse.click(Button.left,1)
                fillMat[y,x]=-1        
    for y in range(h):
        if(x+2<w) and (imgrgb[y,x,0]!=255 or imgrgb[y,x,1]!=255 or imgrgb[y,x,2]!=255):
            drawMat[y,x+2]=bestColor(LabColor(img[y,x+2,0]*100/255.0,img[y,x+2,1]-128,img[y,x+2,2]-128))
            fillMat[y,x+2]=drawMat[y,x+2]

#fill
mouse.position=(upleft[0]+fill[0],upleft[1]+fill[1])
mouse.click(Button.left,1)
for c in range(1,22):
    unused=True
    for x in range(w):
        for y in range(h):
            if fillMat[y,x]==c and isEdge2(y,x,c):
                if unused:
                    mouse.position=(upleft[0]+colordx[c],upleft[1]+colordy[c])
                    mouse.click(Button.left,1)
                    unused=False
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
    