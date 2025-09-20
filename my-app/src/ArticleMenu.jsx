import './ArticleMenu.css'
import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import articlelist from "./JSON/ArticleList.json"
import { Link } from 'react-router-dom';

function ArticleMenu() {

    return (
        <div>
            <div className="ar-menu-title">
                <h2>ニュース・記事一覧</h2>
                <p>高校の各クラス企画について</p>
                <p>まとめた記事や、記念祭内での</p>
                <p>ニュースをご覧いただけます。</p>
            </div>
            <div className="ar-list">
                {articlelist.map(item => (
                    <Link key={item[0]} to="/article" state={{ title: item[0]}} className="ar-con" style={{ backgroundImage: `url(${item[4]})` }}>
                        <div className="white-cover">
                            <p>{item[0]}</p>
                            <h3>{item[1]}</h3>
                            <p>{item[2]}</p>
                        </div>


                    </Link>

                ))}

            </div>
        </div>
    )
}

export default ArticleMenu;