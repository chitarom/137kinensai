import "./Administrator.css"
import { supabase } from "./supabase"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Administrator() {
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
            const fetchNews = async () => {
                const {data, error} = await supabase
                    .from("news")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (error) {
                    console.error("取得エラー:", error);
                } else {
                    setNewsList(data);
                }
            }
            fetchNews();
        },[]);

    return (
        <div className="ad-con">
            <Link to="/" className="ad-button">コメント検閲</Link>
            <Link to="/" className="ad-button">ニュース管理</Link>
        </div>
    )
}

export default Administrator