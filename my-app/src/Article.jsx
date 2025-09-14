import "./Article.css";
import articlelist from "./JSON/ArticleList.json";
import { useLocation } from "react-router-dom";

function Article() {
    const location = useLocation();
    const { title } = location.state || {}; // ← ここで Link から渡された state を取得

    if (!title) {
        return <p>記事が見つかりませんでした。</p>;
    }

    const matched = articlelist.filter(item => item[1] === title);

    return (
        <div>
            {matched.map(item => (
                <div className="ar" key={item[0]}>
                    <div className="ar-title-con">
                        <p>{item[0]}</p>
                        <h2>{item[1]}</h2>
                        
                        <p>{item[2]}</p>
                        
                        
                    </div>
                    <img className="ar-image" src={item[4]} alt="" />
                    <div className="ar-passage">
                        <p style={{ whiteSpace: 'pre-line' }}>{item[3]}</p>
                    </div>


                </div>
            ))}
        </div>
    );
}

export default Article;
