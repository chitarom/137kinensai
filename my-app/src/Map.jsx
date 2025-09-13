import './Map.css'
import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Group, Rect } from "react-konva";
import data from "./JSON/ProjectData.json";
import DisplayDetail from './DisplayDetail';
import { v4 as uuid } from "uuid";


function Map() {
    const [displayMap, setDisplayMap] = useState(1);
    const [SVG_URL, setSVG_URL] = useState("src/pictures/1f.svg");
    const changeDisplayMap = [temp(0), temp(1), temp(2), temp(3), temp(4)];
    function temp(int) {
        return () => {
            setDisplayMap(int);
            var str = "src/pictures/";
            switch (int) {
                case 1:
                    str += "1f.svg";
                    break;
                case 2:
                    str += "2f.svg";
                    break;
                case 3:
                    str += "3f.svg";
                    break;
                case 4:
                    str += "4-5f.svg";
                    break;

            }
            setSVG_URL(str);
        }
    }
    console.log(SVG_URL);

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

    const [rects, setRects] = useState([]);

    useEffect(() => {
        // SVGファイルを取得
        fetch(SVG_URL)
            .then(res => res.text())
            .then(text => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, "image/svg+xml");

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
            });
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
        image.onload = () => setImg(image);
        image.src = SVG_URL;
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
    }, [SVG_URL]);

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
                        </Group>
                    </Layer>
                </Stage>
            </div>
            <div className='map-switches'>
                <button className={'map-switch' + (displayMap == 1 ? ' active' : '')} onClick={changeDisplayMap[1]}>1F</button>
                <button className={'map-switch' + (displayMap == 2 ? ' active' : '')} onClick={changeDisplayMap[2]}>2F</button>
                <button className={'map-switch' + (displayMap == 3 ? ' active' : '')} onClick={changeDisplayMap[3]}>3F</button>
                <button className={'map-switch' + (displayMap == 4 ? ' active' : '')} onClick={changeDisplayMap[4]}>4-5F</button>
            </div>
            {(displayingDetail >= 0) &&
                (
                    <DisplayDetail displayDetailContents={displayDetailContents} setDisplayingDetail={setDisplayingDetail} />
                )}
        </div>
    );

}

export default Map;