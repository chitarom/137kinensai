import './ArticleMenu.css'
import { supabase } from './supabase';
import { useEffect, useState } from 'react';

function ArticleMenu() {
    const [newsList,setNewsList] = useState([])

    useEffect(() => {
        const fetchNews = async () => {
            const {data, error} = await supabase
                .from("article")
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
        <div>
            <div className="ar-menu-title">
                <h2>ニュース・記事一覧</h2>
            </div>
        </div>
    )
}

export default ArticleMenu;