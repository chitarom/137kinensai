import './Map.css'
import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text, Shape } from "react-konva";
import data from "./JSON/ProjectData.json";
import enotabipictures from "./JSON/EnotabiPictures.json";
import DisplayDetail from './DisplayDetail';
import { v4 as uuid } from "uuid";
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import entire from '/pictures/entire_map.svg';
import f1 from '/pictures/1f.svg';
import f2 from '/pictures/2f.svg';
import f3 from '/pictures/3f.svg';
import f45 from '/pictures/4-5f.svg';
import cf1 from '/pictures/1f-monochrome.svg';
import cf2 from '/pictures/2f-monochrome.svg';
import cf3 from '/pictures/3f-monochrome.svg';
import cf45 from '/pictures/4-5f-monochrome.svg';
import centire from '/pictures/entire_map-monochrome.svg';
import giftpicture from "/pictures/giftpicture.png";
import sampjpg from "/pictures/kaijinlogo.png"


function Map() {
    const samps = [sampjpg, sampjpg, sampjpg, sampjpg, sampjpg, sampjpg, sampjpg];
    const location = useLocation();
    const navigate = useNavigate();
    const [isFirstLoad, setFirstLoad] = useState(true);
    const [displayMap, setDisplayMap] = useState(0);
    const [gotNewPiece, setGotNewPiece] = useState([false, null]);
    const [triangle, setTriangle] = useState(null);
    const [sample, setSample] = useState({ "map.at_0": null, "map.at_1": null, "map.at_2": null, "map.at_3": null, "map.at_4": null, "map.at_5": null, "map.at_6": null });

    for (let i = 0; i < 7; i++) {
        const samp0 = new window.Image();
        samp0.crossOrigin = "anonymous";
        samp0.onload = () => { var s = sample; s["map.at_" + i] = samp0; setSample(s) };
        samp0.src = samps[i];
    }

    var b = false;
    var preSVG = entire;

    if (localStorage.getItem("pictures") == null) localStorage.setItem("pictures", "[]");

    if (location.state != null && isFirstLoad) {
        b = true;
        setFirstLoad(false);
        const id = location.state.text;
        if (location.state.num == 1) {
            var pictures = JSON.parse(localStorage.getItem("pictures"));
            if (!pictures.includes(id)) pictures.push(id);
            setDisplayMap(enotabipictures[id][3]);
            switch (enotabipictures[id][3]) {
                case 5:
                    preSVG = cf1;
                    break;
                case 6:
                    preSVG = cf2;
                    break;
                case 7:
                    preSVG = cf3;
                    break;
                case 8:
                    preSVG = cf45;
                    break;
                case 9:
                    preSVG = centire;
                    break;
            };
            localStorage.setItem("pictures", JSON.stringify(pictures));
            if (localStorage.getItem("pieces") == null) localStorage.setItem("pieces", "[]");
            var pieces = JSON.parse(localStorage.getItem("pieces"));
            var bool = false;
            var r;
            if (pieces.length <= 5)
                while (!bool) {
                    var random = Math.floor(Math.random() * 6);
                    if (pieces.indexOf(random) <= -1) { pieces.push(random); bool = true; r = random; }
                }
            console.log("pieces: " + JSON.stringify(pieces));
            localStorage.setItem("pieces", JSON.stringify(pieces));
            //ここに画像を大きく見せるプログラムを書く
            setGotNewPiece([true, r]);
        } else if (location.state.num == 2) {
            //id: "map_type(0: entire_map, 1: floor1, 2: floor2, 3: floor3, 4:floor4-5)|x,y|direction(e.g 45)"
            var map = Number(id.split("|")[0]);
            var pos = { x: Number(id.split("|")[1].split(",")[0]), y: Number(id.split("|")[1].split(",")[1]) };
            var dir = id.split("|")[2];
            console.log(pos);
            setDisplayMap(map);
            switch (map) {
                case 0:
                    preSVG = entire;
                    break;
                case 1:
                    preSVG = f1;
                    break;
                case 2:
                    preSVG = f2;
                    break;
                case 3:
                    preSVG = f3;
                    break;
                case 4:
                    preSVG = f45;
                    break;
            };
            setTriangle([map, pos, dir]);
        }
    }

    const closeGNP = () => {
        return () => {
            setGotNewPiece([false, gotNewPiece[1]]);
        }
    };

    const picts = JSON.parse(localStorage.getItem("pictures"));

    const [isEnotabi, setEnotabi] = useState(b ? true : false);
    const [SVG, setSVG] = useState(preSVG);

    const toggleEnotabi = () => {
        return () => {
            var bool = !isEnotabi;
            var int = displayMap;
            setEnotabi(bool);
            if (int == 0) {
                setDisplayMap(9);
            } else if (int == 9) {
                setDisplayMap(0);
                int = 0;
            } else if (int <= 4) {
                setDisplayMap(bool ? int + 4 : int);
                if (!bool) int += 4;
            } else {
                setDisplayMap(bool ? int : int - 4);
                if (!bool) int -= 4;
            }
            console.log(int);
            var svg;
            switch (int) {
                case 0:
                    svg = bool ? centire : entire;
                    break;
                case 1:
                    svg = bool ? cf1 : f1;
                    break;
                case 2:
                    svg = bool ? cf2 : f2;
                    break;
                case 3:
                    svg = bool ? cf3 : f3;
                    break;
                case 4:
                    svg = bool ? cf45 : f45;
                    break;
            }
            setLoaded(false);
            setSVG(svg);
        };
    };

    const changeDisplayMap = [temp(0), temp(1), temp(2), temp(3), temp(4)];
    function temp(int) {
        return () => {
            if (int != 0)
                setDisplayMap(isEnotabi ? int + 4 : int);
            else setDisplayMap(isEnotabi ? 9 : 0);
            var svg;
            switch (int) {
                case 0:
                    svg = isEnotabi ? centire : entire;
                    break;
                case 1:
                    svg = isEnotabi ? cf1 : f1;
                    break;
                case 2:
                    svg = isEnotabi ? cf2 : f2;
                    break;
                case 3:
                    svg = isEnotabi ? cf3 : f3;
                    break;
                case 4:
                    svg = isEnotabi ? cf45 : f45;
                    break;

            }
            if (displayMap != int) setLoaded(false);
            setSVG(svg);
        }
    }

    /*
    <div className='map-parent'>
            <div className='map-list'>
                <MapCanvas {...canvasProps} />
                <canvas className={'map' + (displayMap == 0 ? ' showing' : '')} id='map-mogi'></canvas>
                <canvas className={'map' + (displayMap == 1 ? ' showing' : '')} id='map-floor1'></canvas>
                <canvas className={'map' + (displayMap == 2 ? ' showing' : '')} id='map-floor2'></canvas>
                <canvas className={'map' + (displayMap == 3 ? ' showing' : '')} id='map-floor3'></canvas>
                <canvas className={'map' + (displayMap == 4 ? ' showing' : '')} id='map-floor45'></canvas>
            </div>
        </div>
     */
    const stageRef = useRef(null);
    const imageRef = useRef(null);
    const [distance, setDistance] = useState([0, 0]);
    const [img, setImg] = useState(null);
    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canOpen, setCanOpen] = useState([false, ""]);
    const [loaded,setLoaded] = useState(false);

    const [rects, setRects] = useState([]);

    useEffect(() => {
        // SVGファイルを取得
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(SVG, "image/svg+xml");

        const rectNodes = svgDoc.querySelectorAll("rect");

        const rectData = Array.from(rectNodes).map((r, i) => ({
            id: r.getAttribute("id") || `rect-${i}`,
            x: parseFloat(r.getAttribute("x") || 0),
            y: parseFloat(r.getAttribute("y") || 0),
            width: parseFloat(r.getAttribute("width") || 0),
            height: parseFloat(r.getAttribute("height") || 0),
            fill: r.getAttribute("fill") || "black",
        }));

        setRects(rectData);
    }, []);

    // rectをクリックしたときに色とサイズを変更
    const handleRectClick = (id) => {
        setRects(rects.map(r =>
            r.id === id
                ? {
                    ...r,
                    fill: r.fill === "red" ? "blue" : "red", // 色をトグル
                    width: r.width * 1.2, // 幅を拡大
                    height: r.height * 1.2, // 高さを拡大
                }
                : r
        ));
    };

    // For touch pinch handling
    const pinchRef = useRef({
        initialDistance: 0,
        initialScale: 1,
        isPinching: false,
    });

    // For dragging
    const dragRef = useRef({
        isDragging: false,
        lastX: 0,
        lastY: 0,
    });

    useEffect(() => {

        const image = new window.Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {setImg(image);setLoaded(true);}
        image.src = SVG;
        /*.addEventListener("click",(e) => {
            console.log("160");
        });*/

        const updateSize = () => {
            const w = Math.min(window.innerWidth, 720);
            const h = Math.min(window.innerHeight - 120, 1000);
            setStageSize({ width: w, height: h });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [SVG]);

    function getDistance(t1, t2) {
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function getMidpoint(t1, t2) {
        return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
    }

    function clientToStageFromClientPoint(clientX, clientY) {
        const stage = stageRef.current;
        const container = stage.container();
        const rect = container.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            dragRef.current.isDragging = true;
            dragRef.current.lastX = e.touches[0].clientX;
            dragRef.current.lastY = e.touches[0].clientY;
            // if a second finger was down earlier, cancel pinch
            pinchRef.current.isPinching = false;
        } else if (e.touches.length === 2) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            pinchRef.current.initialDistance = getDistance(t1, t2);
            pinchRef.current.initialScale = scale;
            pinchRef.current.isPinching = true;
            // cancel drag when starting pinch
            dragRef.current.isDragging = false;
        }
    }

    function handleTouchMove(e) {
        if (e.touches.length === 1 && dragRef.current.isDragging) {
            const dx = e.touches[0].clientX - dragRef.current.lastX;
            const dy = e.touches[0].clientY - dragRef.current.lastY;
            dragRef.current.lastX = e.touches[0].clientX;
            dragRef.current.lastY = e.touches[0].clientY;
            setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
            setDistance([distance[0] + dx, distance[1] + dy]);
        } else if (e.touches.length === 2 && pinchRef.current.isPinching) {
            e.preventDefault(); // stop page scroll
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const newDist = getDistance(t1, t2);
            const newMidClient = getMidpoint(t1, t2);

            const { initialDistance, initialScale } = pinchRef.current;
            if (!initialDistance) return;

            // compute new scale
            const newScale = clamp((initialScale * newDist) / initialDistance, 0.2, 5);

            // Map midpoint client coords to stage coords
            const stagePoint = clientToStageFromClientPoint(newMidClient.x, newMidClient.y);

            // compute local point in image/group coords that is currently under the midpoint
            // stagePoint = position + scale * local  => local = (stagePoint - position) / scale
            const local = {
                x: (stagePoint.x - position.x) / scale,
                y: (stagePoint.y - position.y) / scale,
            };

            // compute new position so that local maps to same stagePoint with newScale
            // p' = stagePoint - newScale * local
            const newPos = {
                x: stagePoint.x - local.x * newScale,
                y: stagePoint.y - local.y * newScale,
            };

            setScale(newScale);
            const dx = e.touches[0].clientX - dragRef.current.lastX;
            const dy = e.touches[0].clientY - dragRef.current.lastY;
            dragRef.current.lastX = e.touches[0].clientX;
            dragRef.current.lastY = e.touches[0].clientY;
            setPosition({ x: newPos["x"] + dx, y: newPos["y"] + dy });
            setDistance([distance[0] + dx, distance[1] + dy]);
        }
    }

    function handleTouchEnd(e) {
        if (e.touches.length === 0) {
            dragRef.current.isDragging = false;
            pinchRef.current.isPinching = false;
            pinchRef.current.initialDistance = 0;
        }
        if (e.touches.length === 1) {
            // if one finger remains, stop pinching and start dragging from that point
            pinchRef.current.isPinching = false;
            dragRef.current.isDragging = true;
            dragRef.current.lastX = e.touches[0].clientX;
            dragRef.current.lastY = e.touches[0].clientY;
        }
        if (Math.abs(distance[0]) < 1 && Math.abs(distance[1]) < 1 && canOpen[0]) {
            for (let i = 0; i < data.length; i++) {
                if (data[i][6] == canOpen[1]) {
                    setDisplayDetailContents([data[i][0], data[i][1], data[i][3], data[i][4], data[i][5], data[i][6]]);
                    setDisplayingDetail(i);
                    break;
                }
            }
        }
        setCanOpen([false, ""]);
        setDistance([0, 0]);
    }

    function clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }

    function handleWheel(e) {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;
        const oldScale = scale;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = { x: (pointer.x - position.x) / oldScale, y: (pointer.y - position.y) / oldScale };

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const factor = 1 + direction * 0.05;
        const newScale = clamp(oldScale * factor, 0.2, 5);
        setScale(newScale);

        const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
        setPosition(newPos);
    }

    function handleMouseDown(e) {
        dragRef.current.isDragging = true;
        dragRef.current.lastX = e.evt.clientX;
        dragRef.current.lastY = e.evt.clientY;
    }

    function handleMouseMove(e) {
        if (!dragRef.current.isDragging) return;
        const dx = e.evt.clientX - dragRef.current.lastX;
        const dy = e.evt.clientY - dragRef.current.lastY;
        dragRef.current.lastX = e.evt.clientX;
        dragRef.current.lastY = e.evt.clientY;
        setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }

    function handleMouseUp() {
        dragRef.current.isDragging = false;
    }

    const [displayingDetail, setDisplayingDetail] = useState(-1);
    const [displayDetailContents, setDisplayDetailContents] = useState(["", "", "", [], [], ""]);

    const rts = [
        [167.517, 227.784, 104.961, 40.780, temp3("講堂"), 0],
        [167.517, 283.676, 104.961, 40.780, temp3("百志館"), 0],
        [205.485, 339.567, 66.993, 39.099, temp3("明照殿"), 0],
        [314.161, 163.334, 78.149, 187.183, temp3("ステージ"), 0],
        [175.61754, 24.870821, 35.682247, 29.913124, temp2("C-15"), 1],
        [139.93529, 24.870821, 35.682247, 29.913124, temp2("C-16"), 1],
        [104.25303, 24.870821, 35.682247, 29.913124, temp2("C-17"), 1],
        [68.570786, 24.870821, 35.682247, 29.913124, temp2("C-18"), 1],
        [17.93198, 66.787804, 32.911251, 29.913124, temp2("C-23"), 1],
        [17.93198, 96.735001, 32.911251, 29.913124, temp2("C-24"), 1],
        [17.93198, 126.69355, 32.911251, 29.913124, temp2("C-25"), 1],
        [17.93198, 156.64073, 32.911251, 29.913124, temp2("C-26"), 1],
        [17.93198, 186.59929, 32.911251, 29.913124, temp2("C-27"), 1],
        [17.93198, 216.54648, 32.911251, 29.913124, temp2("C-28"), 1],
        [209.809, 24.316, 36.786, 31.021, temp2("C-10"), 2],
        [174.158, 24.316, 36.786, 31.021, temp2("C-11"), 2],
        [138.507, 24.316, 36.786, 31.021, temp2("C-12"), 2],
        [102.856, 24.316, 36.786, 31.021, temp2("C-13"), 2],
        [67.206, 24.316, 36.786, 31.021, temp2("C-14"), 2],
        [16.611, 66.196, 34.017, 31.021, temp2("C-19"), 2],
        [16.611, 96.128, 34.017, 31.021, temp2("C-20"), 2],
        [16.611, 126.049, 34.017, 31.021, temp2("C-21"), 2],
        [16.611, 155.981, 34.017, 31.021, temp2("C-22"), 2],
        [267.302, 174.147, 36.786, 31.021, temp2("C-01"), 3],
        [267.302, 143.999, 36.786, 31.021, temp2("C-02"), 3],
        [267.302, 113.965, 36.786, 31.021, temp2("C-03"), 3],
        [267.302, 84.089, 36.786, 31.021, temp2("C-04"), 3],
        [267.302, 54.202, 36.786, 31.021, temp2("C-05"), 3],
        [174.158, 24.316, 36.786, 31.021, temp2("C-06"), 3],
        [138.507, 24.316, 36.786, 31.021, temp2("C-07"), 3],
        [102.856, 24.316, 36.786, 31.021, temp2("C-08"), 3],
        [67.206, 24.316, 36.786, 31.021, temp2("C-09"), 3],
        [16.611, 66.196, 34.017, 31.021, temp2("C-29"), 3],
        [16.611, 96.128, 34.017, 31.021, temp2("C-30"), 3],
        [16.611, 126.049, 34.017, 31.021, temp2("C-31"), 3],
        [16.611, 155.981, 34.017, 31.021, temp2("C-32"), 3],
        [16.611, 185.902, 34.017, 31.021, temp2("C-33"), 3],
        [16.611, 215.834, 34.017, 31.021, temp2("C-34"), 3],
        [5.151, 269.118, 34.017, 30.919, temp2("C-35"), 3],
        [37.988, 269.118, 34.017, 30.919, temp2("C-36"), 3],
        [70.871, 269.118, 34.017, 30.919, temp2("C-37"), 3],
        [103.753, 269.118, 34.017, 30.919, temp2("C-38"), 3]
    ];

    function temp2(str) {
        return () => {
            setCanOpen([true, str]);
        };
    };

    function temp3(keyword) {
        return () => {
            navigate('/search?keyword=' + keyword, {});
        };
    }

    return (
        <div className='map-parent'>
            <div
                style={{ touchAction: "none" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    ref={stageRef}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ border: "1px solid #ddd", background: "rgb(219,219,219)" }}
                >
                    <Layer>
                        <Group x={position.x} y={position.y} scaleX={scale} scaleY={scale}>
                            {img && (
                                <KonvaImage
                                    image={img}
                                    x={0}
                                    y={50}
                                    ref={imageRef}
                                    width={img.width}
                                    height={img.height}
                                />
                            )}
                            {
                                rts.map((obj) => {
                                    return displayMap == obj[5] ? <Rect
                                        x={obj[0]}
                                        y={obj[1] + 50}
                                        width={obj[2]}
                                        height={obj[3]}
                                        onTap={obj[4]}
                                        key={uuid()} /> : <Group key={uuid()} />;
                                })
                            }
                            {(isEnotabi) &&
                                (
                                    Object.keys(enotabipictures).map((key) => {
                                        if (enotabipictures[key][3] != displayMap)
                                            return <Group key={uuid()} />;
                                        else
                                            return picts.includes(key) ?
                                                <Group key={uuid()}>
                                                    <KonvaImage
                                                        image={sample[key]}
                                                        x={enotabipictures[key][1][0]}
                                                        y={enotabipictures[key][1][1]}
                                                        width={enotabipictures[key][2][0]}
                                                        height={enotabipictures[key][2][1]}
                                                        fill="black"
                                                        key={uuid()}
                                                    /></Group> :
                                                <Group key={uuid()}>
                                                    <Rect
                                                        x={enotabipictures[key][1][0]}
                                                        y={enotabipictures[key][1][1]}
                                                        width={enotabipictures[key][2][0]}
                                                        height={enotabipictures[key][2][1]}
                                                        fill="black"
                                                        key={uuid()} />
                                                    <Text
                                                        x={enotabipictures[key][1][0] + 10}
                                                        y={enotabipictures[key][1][1] + 5}
                                                        fontFamily="sans-serif"
                                                        fontSize={20}
                                                        text="?"
                                                        fill="white"
                                                        key={uuid()} /></Group>;
                                    })
                                )
                            }
                            {(triangle != null) &&
                                (
                                    triangle[0] == displayMap ?
                                        <Shape
                                            sceneFunc={(context, shape) => {
                                                context.beginPath();
                                                context.moveTo(-12, -15);
                                                context.lineTo(-12, 15);
                                                context.lineTo(0, 0);
                                                context.closePath();
                                                context.fillStrokeShape(shape);
                                            }}
                                            x={triangle[1]["x"]}
                                            y={triangle[1]["y"] + 50}
                                            rotation={triangle[2]}
                                            fill="red"
                                            stroke="white"
                                            strokeWidth={1}
                                        /> : <></>
                                )
                            }
                        </Group>
                    </Layer>
                </Stage>
            </div>
            <div className='map-switches'>
                <button className={'map-switch' + (displayMap == 0 || displayMap == 9 ? ' active' : '')} onClick={changeDisplayMap[0]}>校内図</button>
                <button className={'map-switch' + (displayMap == 1 || displayMap == 5 ? ' active' : '')} onClick={changeDisplayMap[1]}>1F</button>
                <button className={'map-switch' + (displayMap == 2 || displayMap == 6 ? ' active' : '')} onClick={changeDisplayMap[2]}>2F</button>
                <button className={'map-switch' + (displayMap == 3 || displayMap == 7 ? ' active' : '')} onClick={changeDisplayMap[3]}>3F</button>
                <button className={'map-switch' + (displayMap == 4 || displayMap == 8 ? ' active' : '')} onClick={changeDisplayMap[4]}>4-5F</button>
            </div>
            <div className='enotabi-switch-wrap'>
                <button className={'enotabi-switch' + (isEnotabi ? ' enotabi' : '')} onClick={toggleEnotabi()}>{isEnotabi ? 'フロアマップへ' : '絵の旅マップへ'}</button>
            </div>
            {(displayingDetail >= 0) &&
                (
                    <DisplayDetail displayDetailContents={displayDetailContents} setDisplayingDetail={setDisplayingDetail} />
                )}
            {(gotNewPiece[0]) &&
                (
                    <div className='gotnewpiece-wrap-wrap'>
                        <div className='gnp-margin1' onClick={closeGNP()}></div>
                        <div className='gotnewpiece-wrap'>
                            <div className='gnp-margin2' onClick={closeGNP()}></div>
                            <div className='gotnewpiece'>
                                <h3>絵をゲットしました！</h3>
                                <div className='gift-wrap'>
                                    <img src="/pictures/sample.jpg" alt="" />
                                </div>
                            </div>
                            <div className='gnp-margin2' onClick={closeGNP()}></div>
                        </div>
                        <div className='gnp-margin1' onClick={closeGNP()}></div>
                    </div>
                )
            }
            {
                (gotNewPiece[1] != null) &&
                (
                    <div className='achievement'>
                        <Link to="/passport">ピースゲット！</Link>
                    </div>
                )
            }
            {(!loaded) &&
                (
                    <div className='loading-wrap'>
                        <div className='loading-txt'>読み込み中...</div>
                    </div>
                )
            }
        </div>
    );

}

export default Map;
