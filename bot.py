from pynput.mouse import Button,Controller
from cv2 import *
import colormath
from colormath.color_objects import LabColor
from colormath.color_diff import delta_e_cie1976 as delta_e_cie2000
import numpy as np

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
def bestColor(col):
    minE=100
    bestCol=0
    for i in range(22):
        E=delta_e_cie2000(col,colors[i])
        if E<minE:
            minE=E
            bestCol=i
    return bestCol

currentColor=0
mouse=Controller()
psize=5
canvasw=167 #255
canvash=125 #191
canvasr=canvash/canvasw
upleft=(713,406)

files=os.listdir("C:\\Users\\brad\\Desktop\\skribblio bot\\image")
img=imread("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0])
h,w,_=img.shape
r=h/w
if (r>canvasr):
    img=resize(img,(int(canvash/r),canvash))
else:
    img=resize(img,(canvasw,int(canvasw*r)))
h,w,_=img.shape
img=cvtColor(img,COLOR_BGR2LAB)
imshow("test",img)
waitKey(0)
# drawmap=np.ones(h*w,int)
# print("pls wait...")
# # for x in range(w):
# #     for y in range(h):
# #         print(x+y*w)
# #         c=LabColor(img[y,x,0],img[y,x,1],img[y,x,2])
# #         bc=bestColor(c)
# #         drawmap[x+y*w]=bc
# for x in range(w):
#     for y in range(h):
#         c=LabColor(img[y,x,0],img[y,x,1],img[y,x,2])
#         bc=bestColor(c)
#         drawmap[x+y*w]=bc


# print("drawing")
# imshow("test",img)
# waitKey(0)
# for i in range(1,22):
#     # mouse.position=(upleft[0]+colordx[i],upleft[1]+colordy[i])
#     # mouse.click(Button.left,1)
#     for x in range(w):
#         for y in range(h):
#             # if drawmap[x+y*w]==i:
#             mouse.position=(upleft[0]+psize*x,upleft[1]+psize*y)
#             mouse.click(Button.left,1)

# for x in range(0,w,2):
#     for y in range(0,h,2):
#         c=LabColor(img[y,x,0]*100/255.0,img[y,x,1]-128,img[y,x,2]-128)
#         bc=bestColor(c)
#         if bc!=0:
#             if bc!=currentColor:
#                 mouse.position=(upleft[0]+colordx[bc],upleft[1]+colordy[bc])
#                 mouse.click(Button.left,1)
#                 currentColor=bc
#             mouse.position=(upleft[0]+psize*x,upleft[1]+psize*y)
#             mouse.click(Button.left,1)
        
for x in range(1,w,1):
    for y in range(1,h,1):
        c=LabColor(img[y,x,0]*100/255.0,img[y,x,1]-128,img[y,x,2]-128)
        bc=bestColor(c)
        if bc!=0:
            if bc!=currentColor:
                mouse.position=(upleft[0]+colordx[bc],upleft[1]+colordy[bc])
                mouse.click(Button.left,1)
                currentColor=bc
            mouse.position=(upleft[0]+psize*x,upleft[1]+psize*y)
            mouse.click(Button.left,1)

print("done")
# mouse.position=upleft
# mouse.click(Button.left,1)
# for i in range(canvash):
#     mouse.move(1,psize)
#     mouse.click(Button.left,1)

