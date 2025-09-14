import "./PageList.css"
import pagelist from "./JSON/PageList.json"
import { Link } from "react-router-dom";

function PageList() {
    return (
        <div>
            <div className="list-title">
                <h2>ページ一覧</h2>
                <p>app内の各ページに飛ぶことができます。</p>
            </div>
            <div className="page-list">
                {pagelist.map(item => (
                    <Link key={item.path} to={item.path} className="page-con">
                        <p>{item.name}</p>

                    </Link>

                ))}

            </div>
        </div>
    )
}

export default PageList;