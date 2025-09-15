import './Passport.css'
import airplane from "/pictures/airplane.png"
import passport from "/pictures/passport.png"
import { useState } from 'react'
import { Link } from 'react-router-dom'
import scope from "/pictures/scope.png"
import camera from "/pictures/camera.png"
import giftpicture from "/pictures/giftpicture.png"
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text } from "react-konva";
import { v4 as uuid } from "uuid";

function Passport() {
    const [activeExplanation, setActiveExplanation] = useState(0);
    const [img, setImg] = useState(null);

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => setImg(image);
    image.src = giftpicture;

    if (localStorage.getItem("pictures") == null) localStorage.setItem("pictures", "[]");
    var pictures = JSON.parse(localStorage.getItem("pictures"));

    var list = [];
    var list1 = [];
    var list2 = [];
    for (let i = 0; i < 6; i++) {
        if (pictures.indexOf("map.at_" + i) > -1)
            list1.push(
                <Group
                    clip={
                        {
                            x: (i % 2) * 100,
                            y: Math.floor(i / 2) * 100,
                            width: 100,
                            height: 100
                        }
                    }
                    key={uuid()}
                >
                    <KonvaImage x={0} y={0} width={200} height={300} image={img}></KonvaImage>
                </Group>
            );
        else list2.push(
            <Group key={uuid()}>
                <Rect x={(i % 2) * 100 + 0.5} y={Math.floor(i / 2) * 100 + 0.5} width={99} height={99} fill="black" stroke="white" strokeWidth={0.5}></Rect>
            </Group>
        );
    }
    list.push(list2);
    list.push(list1);




    return (
        <div className="passport-con">
            <div className="title-con">
                <img src={airplane} alt="" />
                <h1>絵の旅パスポート</h1>
                <img src={passport} alt="" />
            </div>
            <div className="explanation-con">
                <button className="ex-button" onClick={() => setActiveExplanation(prev => (prev + 1) % 2)}>絵の旅パスポートとは？ <span className="oo8cff">{activeExplanation === 1 ? '▲' : '▼'}</span></button>
                {activeExplanation == 1 && <p>
                    校内のいろいろなところに貼ってある絵を探して、QRコードを読み取ってみよう！読み取った絵はコレクションに追加されるよ！6枚集めると、137th記念祭のオリジナル壁紙もらえる！
                </p>}
            </div>
            <div className="passport-menu">
                <Link to="/" className="pass-menu-button">
                    <img src={scope} alt="スコープアイコン" />
                    <h2>絵を探す</h2>
                </Link>
                <Link to="/readqr" className="pass-menu-button">
                    <img src={camera} alt="カメラ" />
                    <h2>QRコード</h2>
                </Link>
            </div>
            <div className="picture-puzzle">
                <h2>イラスト進捗</h2>
                <Stage
                    width={200}
                    height={300}
                >
                    <Layer>
                        <Rect x={0} y={0} width={200} height={300} fill="white"></Rect>
                        {list}
                    </Layer>
                </Stage>
            </div>
        </div>
    )

}

export default Passport;