import './Event.css'
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

function Event() {
    const [infoList, setInfoList] = useState([]);

    useEffect(() => {
        const fetchInfo = async () => {
            const { data, error } = await supabase.from("users").select("*");
            if (error) console.error("取得エラー:", error);
            else {
                console.log("取得データ:", data);
                setInfoList(data);
            }
            };
            fetchInfo();
        }, []);


    return (
        <div>
            <ul>
                {infoList.map((item) => (
                    <li key={item.id}>
                        <strong>{item.username}</strong>: {item.password}
                    </li>
                ))}
            </ul>


        </div>

    )
}

export default Event;