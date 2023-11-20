from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
import torch
import cv2
import numpy as np
import os
from urllib.request import urlopen
from PIL import Image
import requests
from dotenv import load_dotenv

load_dotenv()


# Load Model
abs_path = os.getcwd()
path_model = os.path.join(abs_path, "assets/models/")
model1 = torch.hub.load(
    "ultralytics/yolov5", "custom", path=path_model + "last_22_7.pt"
)
model1.conf = 0.2

config = Cfg.load_config_from_name("vgg_transformer")
# config["weights"] = os.path.join(path_model, "vgg_seq2seq.pth")
config["device"] = "cuda"
detector = Predictor(config)


def detected(img_path):
    tl = []
    tr = []
    br = []
    bl = []

    # mess = ''
    # img = cv2.imread(img_path)
    req = urlopen(img_path)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    # orig = img.copy()

    border_size = 150
    img = cv2.copyMakeBorder(
        img,
        top=border_size,
        bottom=border_size,
        left=border_size,
        right=border_size,
        borderType=cv2.BORDER_CONSTANT,
        value=[255, 255, 255],
    )
    orig = img.copy()
    rs = model1(img)
    out = rs.pandas().xyxy[0]

    if (
        len(out[out["name"] == "tl"]) == 1
        and len(out[out["name"] == "tr"]) == 1
        and len(out[out["name"] == "br"]) == 1
        and len(out[out["name"] == "bl"]) == 1
    ):
        for i in range(len(out)):
            if out["name"][i] == "br":
                x = int((out["xmin"][i] + out["xmax"][i]) // 2)
                y = int((out["ymin"][i] + out["ymax"][i]) // 2)
                br.append(x)
                br.append(y)

            elif out["name"][i] == "tr":
                x = int((out["xmin"][i] + out["xmax"][i]) // 2)
                y = int((out["ymin"][i] + out["ymax"][i]) // 2)
                tr.append(x)
                tr.append(y)

            elif out["name"][i] == "tl":
                x = int((out["xmin"][i] + out["xmax"][i]) // 2)
                y = int((out["ymin"][i] + out["ymax"][i]) // 2)
                tl.append(x)
                tl.append(y)

            else:
                x = int((out["xmin"][i] + out["xmax"][i]) // 2)
                y = int((out["ymin"][i] + out["ymax"][i]) // 2)
                bl.append(x)
                bl.append(y)

        input_pts = np.float32([tl, tr, br, bl])

        output_pts = np.float32([[0, 0], [1000, 0], [1000, 600], [0, 600]])

        M = cv2.getPerspectiveTransform(input_pts, output_pts)

        warped = cv2.warpPerspective(img, M, (1000, 600), flags=cv2.INTER_LINEAR)
        warped = cv2.cvtColor(warped, cv2.COLOR_BGR2RGB)
        mess = "success"

    elif (
        len(out[out["name"] == "tl"]) == 2
        and len(out[out["name"] == "tr"]) == 2
        and len(out[out["name"] == "br"]) == 2
        and len(out[out["name"] == "bl"]) == 2
    ):
        mess = "More than one card"
        warped = None
        orig = None
    else:
        mess = "Is not detected card"
        warped = None
        orig = None

    return tl, tr, br, bl, warped, orig, mess


def information(warped):
    name_ = warped[323:374, 290:800]
    ID_ = warped[240:300, 400:760]
    date_ = warped[365:405, 560:760]
    sex_ = warped[390:460, 460:570]
    origin_ = warped[470:520, 290:900]
    residence1_ = warped[505:550, 685:900]
    residence2_ = warped[545:620, 290:900]
    return name_, ID_, date_, sex_, origin_, residence1_, residence2_


# cái này của mặt sau CCCD mới
def information2(warped):
    datee = warped[70:115, 405:545]
    return datee


# cái này của mặt trước cccd cũ
def information3(warped):
    warped = cv2.resize(warped, (1000, 600))
    ID_ = warped[150:250, 430:1000]
    name_ = warped[210:320, 400:1000]
    date_ = warped[290:370, 550:1000]
    sex_ = warped[340:400, 400:550]
    # origin_ = warped[400: 510, 450: 1000]
    origin1_ = warped[410:450, 440:1000]
    origin2_ = warped[440:495, 440:1000]
    residence1_ = warped[465:535, 480:1000]
    residence2_ = warped[510:770, 410:1000]

    return name_, ID_, date_, sex_, origin1_, origin2_, residence1_, residence2_


# cái này là của mặt trước CMND
def information4(warped):
    # warped = cv2.resize(warped, (1000, 600))
    ID_ = warped[130:210, 460:950]
    name1_ = warped[180:270, 400:950]
    name2_ = warped[250:320, 280:950]
    date_ = warped[300:380, 440:950]
    origin1_ = warped[370:430, 500:950]
    origin2_ = warped[410:500, 280:950]
    residence1_ = warped[470:540, 590:950]
    residence2_ = warped[520:590, 280:950]

    return name1_, name2_, ID_, date_, origin1_, origin2_, residence1_, residence2_


# cái này là ủa của mặt sau CCCD
def information7(warped):
    d1 = warped[280:330, 500:980]

    # d2 = warped[280:330, 750:800]

    # d3 = warped[280:330, 870:1000]
    return d1


# cái này là của mặt sau CMND
def information6(warped):
    d1 = warped[300:360, 400:950]
    # d2 = warped[300:350, 670:760]
    # d3 = warped[300:350, 820:970]
    return d1


def plot(imgPath):
    tl, tr, br, bl, warped, orig, mess = detected(imgPath)
    os.chdir(os.path.join(abs_path, "assets/images"))
    imgName = imgPath.split("/")[-1].split(".")[0] + "_out.png"
    cv2.imwrite(imgName, warped)

    file = {"file": (imgName, open(imgName, "rb").read(), "image/png")}
    response = requests.post(os.getenv("API_UPLOAD"), files=file)
    UrlUpload = response.json().get("data")[0].get("url")
    if UrlUpload != None:
        os.remove(imgName)
    # read information
    # name_, ID_, date_, sex_, origin_, residence1_, residence2_ = information(warped)
    (
        name1_,
        name2_,
        ID_,
        date_,
        origin1_,
        origin2_,
        residence1_,
        residence2_,
    ) = information4(warped)
    name_ = Image.fromarray(name1_)
    date_ = Image.fromarray(date_)
    # sex_ = Image.fromarray(sex_)
    ID_ = Image.fromarray(ID_)
    origin_ = Image.fromarray(origin1_)
    origin2_ = Image.fromarray(origin2_)
    residence1_ = Image.fromarray(residence1_)
    residence2_ = Image.fromarray(residence2_)
    name = detector.predict(name_, return_prob=False)
    date = detector.predict(date_, return_prob=False)
    # gender = detector.predict(sex_, return_prob=False)
    ID = detector.predict(ID_, return_prob=False)
    origin = detector.predict(origin_, return_prob=False)
    residence1 = detector.predict(residence1_, return_prob=False)
    residence2 = detector.predict(residence2_, return_prob=False)
    residence = residence1 + ", " + residence2
    imgOutUrl = UrlUpload
    # return name, date, gender, ID, origin, residence, mess, imgOutUrl
    return name, date, ID, origin, residence, mess, imgOutUrl
