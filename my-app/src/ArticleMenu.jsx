import './ArticleMenu.css'
import { supabase } from './supabase';
import { useEffect, useState } from 'react';
import articlelist from "./JSON/ArticleList.json"

function ArticleMenu() {

    function createList() {
        let newlist = [];

        for (let i = 0; i < articlelist.length; i++) {
            const item = articlelist[i];
            if (!Array.isArray(item) || item.length < 3) continue;

            const [className, title, passage] = item;
            const object = {
                class: className,
                title,
                passage,
            };
            newlist.push(object);
        }

        return newlist;
    }

    const list = createList();




    return (
        <div>
            <div className="ar-menu-title">
                <h2>ニュース・記事一覧</h2>
            </div>
        </div>
    )
}

export default ArticleMenu;