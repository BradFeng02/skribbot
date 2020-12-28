import numpy as np
from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000

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

colorcode=np.array(["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c"])

def bestColor(col): #col is colorlab obj
    minE = delta_e_cie2000(col,colors[0])
    bestCol=0
    for i in range(0,22):
        E=delta_e_cie2000(col,colors[i])
        if E<minE:
            minE=E
            bestCol=i
    return bestCol

txtfile=open("C:\\Users\\brad\\Desktop\\skribblio bot\\best_colors.txt",'a')

for rgb in range(16777216):
    red = (rgb>>16)&0x0ff
    green = (rgb>>8)&0x0ff
    blue = (rgb)&0x0ff
    rgbcol=sRGBColor(red,green,blue,True)
    labcol=convert_color(rgbcol,LabColor)
    best=bestColor(labcol)
    txtfile.write(colorcode[best])
    if rgb/100000.0==int(rgb/100000):
        print(rgb,"out of 16777216")

txtfile.close()

# rgb = ((r&0x0ff)<<16)|((g&0x0ff)<<8)|(b&0x0ff)
# red = (rgb>>16)&0x0ff
# green = (rgb>>8)&0x0ff
# blue = (rgb)&0x0ff