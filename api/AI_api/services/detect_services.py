from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
from config import ABS_PATH
import torch
import cv2
import numpy as np
import os
from PIL import Image
from dotenv import load_dotenv

load_dotenv()


# Load Model
path_model = os.path.join(ABS_PATH, "assets/models/")
modelFront = torch.hub.load(
    "ultralytics/yolov5", "custom", path=path_model + "last_22_7.pt"
)
modelFront.conf = 0.2

modelBack = torch.hub.load(
    "ultralytics/yolov5", "custom", path=path_model + "last_24_7.pt"
)
modelBack.conf = 0.2

config = Cfg.load_config_from_name("vgg_transformer")
config["device"] = "cuda"
detector = Predictor(config)


def detected_front(img):
    tl = []
    tr = []
    br = []
    bl = []

    # img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

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
    rs = modelFront(img)
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
        mess = "Hình ảnh nhiều hơn một thẻ!"
        warped = None
        orig = None
    else:
        mess = "Không nhận diện được thẻ trong hình ảnh!"
        warped = None
        orig = None

    return tl, tr, br, bl, warped, orig, mess


def detected_back(img):
    tl = []
    tr = []
    br = []
    bl = []

    # img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    border_size = 350
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
    rs = modelBack(img)
    out = rs.pandas().xyxy[0]

    if (
        len(out[out["name"] == "tl"]) == 1
        and len(out[out["name"] == "tr"]) == 1
        and len(out[out["name"] == "br"]) == 1
        and len(out[out["name"] == "bl"]) == 1
    ):
        for i in range(len(out)):
            #     print(out['name'][i])
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
        mess = "Hình ảnh nhiều hơn một thẻ!"
        warped = None
        orig = None
    else:
        mess = "Không nhận diện được thẻ trong hình ảnh!"
        warped = None
        orig = None
    return tl, tr, br, bl, warped, orig, mess


# Mặt trước CCCD mới
def information(warped):
    name_ = warped[323:374, 290:800]
    ID_ = warped[240:300, 400:760]
    date_ = warped[365:405, 560:760]
    sex_ = warped[390:460, 460:570]
    origin_ = warped[470:520, 290:900]
    residence1_ = warped[505:550, 685:900]
    residence2_ = warped[545:620, 290:900]
    avatar_ = warped[210:510, 35:275]
    out_date_ = warped[527:557, 150:285]
    return (
        name_,
        ID_,
        date_,
        sex_,
        origin_,
        residence1_,
        residence2_,
        avatar_,
        out_date_,
    )


# cái này của mặt sau CCCD mới
def information2(warped):
    datee = warped[70:115, 405:545]
    p_identification = warped[40:70, 33:320]
    return datee


# cái này của mặt trước cccd cũ
def information3(warped):
    warped = cv2.resize(warped, (1000, 600))
    ID_ = warped[150:250, 430:1000]
    name_ = warped[210:320, 400:1000]
    date_ = warped[290:370, 550:1000]
    sex_ = warped[340:400, 400:550]
    origin1_ = warped[410:450, 440:1000]
    origin2_ = warped[440:495, 440:1000]
    residence1_ = warped[465:535, 480:1000]
    residence2_ = warped[510:770, 410:1000]
    avatar_ = warped[227:535, 49:315]
    out_date_ = warped[552:590, 215:370]

    return (
        name_,
        ID_,
        date_,
        sex_,
        origin1_,
        origin2_,
        residence1_,
        residence2_,
        avatar_,
        out_date_,
    )


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
    avatar_ = warped[245:534, 55:290]
    return name1_, name2_, ID_, date_, origin1_, origin2_, residence1_, residence2_


# cái này là của mặt sau CCCD cũ
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


def detect_service(imgPath, typeCard):
    if (
        typeCard == "frontCCCD"
        or typeCard == "frontCCCD_old"
        or typeCard == "frontCMND"
    ):
        img = cv2.imread(imgPath)
        tl, tr, br, bl, warped, orig, mess = detected_front(img)
        if warped is None:
            return {"isFalse": True, "mess": mess, "imgOutUrl": None}
        imgName = imgPath.split("/")[-1].split(".")[0] + "_out.png"
        cv2.imwrite(
            os.path.join(ABS_PATH, f"public/paper_service/cards/{imgName}"), warped
        )
        imgOutUrl = f"{os.getenv('HOST_NAME')}/file/paper_service/cards/{imgName}"
        if typeCard == "frontCCCD":
            (
                name_,
                ID_,
                date_,
                sex_,
                origin_,
                residence1_,
                residence2_,
                avatar_,
                out_date_,
            ) = information(warped)
            name_ = Image.fromarray(name_)
            date_ = Image.fromarray(date_)
            sex_ = Image.fromarray(sex_)
            ID_ = Image.fromarray(ID_)
            origin_ = Image.fromarray(origin_)
            residence1_ = Image.fromarray(residence1_)
            residence2_ = Image.fromarray(residence2_)
            out_date_ = Image.fromarray(out_date_)
            name = detector.predict(name_, return_prob=False)
            date = detector.predict(date_, return_prob=False)
            gender = detector.predict(sex_, return_prob=False)
            ID = detector.predict(ID_, return_prob=False)
            origin = detector.predict(origin_, return_prob=False)
            residence1 = detector.predict(residence1_, return_prob=False)
            residence2 = detector.predict(residence2_, return_prob=False)
            out_date = detector.predict(out_date_, return_prob=False)
            residence = residence1 + ", " + residence2

            avatar_path = os.path.join(
                ABS_PATH, f"public/paper_service/avatars/{imgName}"
            )

            cv2.imwrite(avatar_path, avatar_)

            res = {
                "name": name,
                "date_of_birth": date,
                "gender": gender,
                "ID": ID,
                "origin": origin,
                "residence": residence,
                "mess": mess,
                "imgOutUrl": imgOutUrl,
                "out_date": out_date,
                "avatar": f"{os.getenv('HOST_NAME')}/file/paper_service/avatars/{imgName}",
            }
            return res
        elif typeCard == "frontCCCD_old":
            (
                name_,
                ID_,
                date_,
                sex_,
                origin1_,
                origin2_,
                residence1_,
                residence2_,
            ) = information3(warped)
            name_ = Image.fromarray(name_)
            ID_ = Image.fromarray(ID_)
            date_ = Image.fromarray(date_)
            sex_ = Image.fromarray(sex_)
            origin1_ = Image.fromarray(origin1_)
            origin2_ = Image.fromarray(origin2_)
            residence1_ = Image.fromarray(residence1_)
            residence2_ = Image.fromarray(residence2_)
            name = detector.predict(name_, return_prob=False)
            ID = detector.predict(ID_, return_prob=False)
            date = detector.predict(date_, return_prob=False)
            gender = detector.predict(sex_, return_prob=False)
            origin1 = detector.predict(origin1_, return_prob=False)
            origin2 = detector.predict(origin2_, return_prob=False)
            residence1 = detector.predict(residence1_, return_prob=False)
            residence2 = detector.predict(residence2_, return_prob=False)
            origin = origin1 + ", " + origin2
            residence = residence1 + ", " + residence2
            res = {
                "ID": ID,
                "name": name,
                "date_of_birth": date,
                "gender": gender,
                "origin": origin,
                "residence": residence,
                "mess": mess,
                "imgOutUrl": imgOutUrl,
            }
            return res
        elif typeCard == "frontCMND":
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
            name1_ = Image.fromarray(name1_)
            name2_ = Image.fromarray(name2_)
            ID_ = Image.fromarray(ID_)
            date_ = Image.fromarray(date_)
            origin1_ = Image.fromarray(origin1_)
            origin2_ = Image.fromarray(origin2_)
            residence1_ = Image.fromarray(residence1_)
            residence2_ = Image.fromarray(residence2_)
            name1 = detector.predict(name1_, return_prob=False)
            name2 = detector.predict(name2_, return_prob=False)
            ID = detector.predict(ID_, return_prob=False)
            date = detector.predict(date_, return_prob=False)
            origin1 = detector.predict(origin1_, return_prob=False)
            origin2 = detector.predict(origin2_, return_prob=False)
            residence1 = detector.predict(residence1_, return_prob=False)
            residence2 = detector.predict(residence2_, return_prob=False)
            name = name1 + " " + name2
            origin = origin1 + ", " + origin2
            residence = residence1 + ", " + residence2
            res = {
                "name": name,
                "ID": ID,
                "date_of_birth": date,
                "origin": origin,
                "residence": residence,
                "mess": mess,
                "imgOutUrl": imgOutUrl,
            }
            return res
    elif typeCard == "backCCCD" or typeCard == "backCCCD_old" or typeCard == "backCMND":
        img = cv2.imread(imgPath)
        tl, tr, br, bl, warped, orig, mess = detected_back(img)
        if warped is None:
            return {"isFalse": True, "mess": mess, "imgOutUrl": None}
        imgName = imgPath.split("/")[-1].split(".")[0] + "_out.png"
        cv2.imwrite(os.path.join(ABS_PATH, f"public/{imgName}"), warped)
        imgOutUrl = f"{os.getenv('HOST_NAME')}/file/{imgName}"
        if typeCard == "backCCCD":
            datee = information2(warped)
            datee = Image.fromarray(datee)
            date = detector.predict(datee, return_prob=False)
            res = {"date": date, "mess": mess, "imgOutUrl": imgOutUrl}
            return res
        elif typeCard == "backCCCD_old":
            datee = information7(warped)
            datee = Image.fromarray(datee)
            date = detector.predict(datee, return_prob=False)
            res = {"date": date, "mess": mess, "imgOutUrl": imgOutUrl}
            return res
        elif typeCard == "backCMND":
            datee = information6(warped)
            datee = Image.fromarray(datee)
            date = detector.predict(datee, return_prob=False)
            res = {"date": date, "mess": mess, "imgOutUrl": imgOutUrl}
            return res
    else:
        return {"isFalse": True, "mess": "Type card not found!", "imgOutUrl": None}
