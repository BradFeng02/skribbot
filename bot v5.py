from pynput.mouse import Button
from pynput.mouse import Controller as mController
from pynput.keyboard import Key
from pynput.keyboard import Controller as kController
from cv2 import *
import time
import numpy as np
import mmap
import win32gui
import keyboard
import clipboard
from PIL import ImageGrab
import pytesseract
pytesseract.pytesseract.tesseract_cmd="C:\\Users\\brad\\Desktop\\skribblio bot\\tesseract\\tesseract.exe"

colors=open("C:\\Users\\brad\\Desktop\\skribblio bot\\best_colors.txt",'r')
colormap=mmap.mmap(colors.fileno(),0,access=mmap.ACCESS_READ)
colorcode=np.array([10,-1,21,12,2,13,14,15,7,16,17,18,-1,-1,8,9,0,3,11,4,6,-1,1,20,5,19])

colordx=np.array([252, 312, 369, 429, 489, 547, 609, 672, 729, 789, 855, 252, 312, 369, 429, 489, 547, 609, 672, 729, 789, 855])
colordy=np.array([1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1565, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623, 1623])

#closest color
def bestColor(col): #col is tuple (b,g,r)
    return colorcode[colormap[((col[2]&0x0ff)<<16)|((col[1]&0x0ff)<<8)|(col[0]&0x0ff)]-97]

stepsize=75
#move mouse smooth
oldpos=(0,0)
def smoove(x,y):
    global oldpos
    global stepsize
    dx=x-oldpos[0]
    dy=y-oldpos[1]
    d=np.sqrt(dx*dx+dy*dy)
    if d<stepsize:
        mouse.position=(x,y)
        oldpos=(x,y)
        return
    steps=d/stepsize
    stepx=dx/steps
    stepy=dy/steps
    for i in range(1,int(steps)+1):
        mouse.position=(oldpos[0]+int(i*stepx),oldpos[1]+int(i*stepy))
        time.sleep(.02)
    mouse.position=(x,y)
    oldpos=(x,y)

#instant mouse move
def fmoove(x,y):
    global oldpos
    mouse.position=(x,y)
    oldpos=(x,y)


#stuff
mouse=mController()
kb=kController()
psize=4.3
canvasw=400 #255
canvash=int(canvasw*191/255.0) #191
canvasr=canvash/canvasw
upleft=(713,406)
pen=(947,1599)
fill=(1217,1599)
clear=(947+920,1599)
quit=False

def sexit():
    keyboard.unhook_all()
    exit()

def escape():
    global quit
    global colormap
    colormap.close()
    print("bye")
    quit=True

#edge of color
def isEdge2(y,x,c):
    return (y-1<0 or fillMat[y-1,x]!=c) and (x-1<0 or fillMat[y,x-1]!=c)

keyboard.add_hotkey('esc',escape)
running=True
print("hi")
print("\nhave skribblio game in maximized window called \"skribblio\".\nhave 2 windows side by side - image folder called \"img\", browser called \"img serch\". DON'T minimize any windows.")
print("to use: hover over word and press DOWN. ESC to quit.\n")
while running:
    while True:
        if quit: sexit()
        elif keyboard.read_key() == 'down':
            if quit: sexit()
            print("new pic")
            mouse.click(Button.left,1)
            time.sleep(.5)
            cap = ImageGrab.grab(bbox =(1547, 273, 2722, 400))
            cap=cv2.cvtColor(np.array(cap), cv2.COLOR_BGR2GRAY)
            word = pytesseract.image_to_string(cap,lang ='eng') 
            while len(word)<1:
                if quit: sexit()
                cap = ImageGrab.grab(bbox =(1547, 273, 2722, 400))
                while len(np.array(cap))<1:
                    if quit: sexit()
                    cap = ImageGrab.grab(bbox =(1547, 273, 2722, 400))
                    time.sleep(.5)
                cap=cv2.cvtColor(np.array(cap), cv2.COLOR_BGR2GRAY)
                word = pytesseract.image_to_string(cap,lang ='eng')
                time.sleep(.5)
            # clipboard.copy("bing.com/images/search?q=-gif%20-svg%20"+word+"&qft=+filterui:photo-clipart")
            win32gui.SetForegroundWindow(win32gui.FindWindow(None,"img"))
            time.sleep(.2)
            win32gui.SetForegroundWindow(win32gui.FindWindow(None,"img serch"))
            time.sleep(.2)
            kb.press(Key.ctrl)
            kb.press('l')
            kb.release('l')
            kb.release(Key.ctrl)
            time.sleep(.2)
            kb.type("bing.com/images/search?q="+word+"%20-gif%20-svg%20&form=QBIR&qft=%20filterui%3Aphoto-clipart")
            time.sleep(.2)
            kb.press(Key.enter)
            kb.release(Key.enter)     
            break
    #shape pic
    files=[]
    while len(files)<1:
        if quit: sexit()
        files=os.listdir("C:\\Users\\brad\\Desktop\\skribblio bot\\image")
        time.sleep(.016)
        if len(files)>0 and files[0][-3:]!="jpg" and files[0][-3:]!="png" and files[0][-3:]!="ebp":
            time.sleep(1)
            os.remove("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0])
            files=[]
            print("needs to be jpg, png, or webp")
    win32gui.SetForegroundWindow(win32gui.FindWindow(None,"skribblio"))
    img=imread("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0],cv2.IMREAD_UNCHANGED)
    h,w,_=img.shape
    if len(img[0,0])>3:
        for x in range(w):
            for y in range(h):
                if quit: sexit()
                if img[y,x][3]==0:
                    img[y,x][0]=255
                    img[y,x][1]=255
                    img[y,x][2]=255
                    img[y,x][3]=255
        img=cv2.cvtColor(img,cv2.COLOR_BGRA2BGR)
    os.remove("C:\\Users\\brad\\Desktop\\skribblio bot\\image\\"+files[0])
    r=h/w
    if (r>canvasr):
        img=resize(img,(int(canvash/r),canvash),interpolation=cv2.INTER_LANCZOS4)
    else:
        img=resize(img,(canvasw,int(canvasw*r)),interpolation=cv2.INTER_LANCZOS4)
    h,w,_=img.shape
    img=cv2.bilateralFilter(img,5,100,100)
    # cv2.imshow("asdf",img)
    # cv2.waitKey(0)

    usedcolors=set([])
    #create draw matrix
    drawMat=np.zeros((h,w))
    for x in range(w):
        for y in range(h):
            if quit: sexit()
            c=bestColor(img[y,x])
            drawMat[y,x]=c
            usedcolors.add(c)

    drawMat=np.uint8(drawMat)
    fillMat=np.copy(drawMat)

    fmoove(upleft[0]+clear[0],upleft[1]+clear[1])
    mouse.click(Button.left,1)
    time.sleep(.7)
    fmoove(upleft[0]+clear[0],upleft[1]+clear[1])
    mouse.click(Button.left,1)
    time.sleep(.1)

#draw
    fmoove(upleft[0]+pen[0],upleft[1]+pen[1])
    mouse.click(Button.left,1)
    for c in range(1,22):
        if c in usedcolors:
            fmoove(upleft[0]+colordx[c],upleft[1]+colordy[c])
            #threshhold current color white else black
            thresh=np.zeros((h,w))
            for x in range(w):
                for y in range(h):
                    if quit: sexit()
                    if drawMat[y,x]==c: thresh[y,x]=255
            thresh=np.uint8(thresh)
            #find contours of current color
            contours, _ = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_TC89_KCOS) #chain_approx_TC89_KCOS
            #click color then draw contours
            mouse.click(Button.left,1)
            # time.sleep(.02)
            for cont in contours:
                if cv2.contourArea(cont)>7:
                    fmoove(upleft[0]+int(psize*cont[0,0,0]),upleft[1]+int(psize*cont[0,0,1]))
                    mouse.press(Button.left)
                    time.sleep(.02)
                    for p in cont:
                        if quit: sexit()
                        smoove(upleft[0]+int(psize*p[0,0]),upleft[1]+int(psize*p[0,1]))
                        time.sleep(.02)
                    smoove(upleft[0]+int(psize*cont[0,0,0]),upleft[1]+int(psize*cont[0,0,1]))
                    time.sleep(.02)
                    mouse.release(Button.left)
            cv2.drawContours(fillMat,contours,-1,99,3)

    #fill
    fmoove(upleft[0]+fill[0],upleft[1]+fill[1])
    mouse.click(Button.left,1)
    for c in range(1,22):
        if c in usedcolors:
            fmoove(upleft[0]+colordx[c],upleft[1]+colordy[c])
            mouse.click(Button.left,1)
            for x in range(w):
                for y in range(h):
                    if quit: sexit()
                    if fillMat[y,x]==c and isEdge2(y,x,c):
                        fmoove(upleft[0]+int(psize*x),upleft[1]+int(psize*y))
                        time.sleep(.01)
                        mouse.click(Button.left,1)
    fmoove(upleft[0]+pen[0],upleft[1]+pen[1])
    mouse.click(Button.left,1)
    print("done, ESC to quit, DOWN for new pic")

colormap.close()
print("bye")