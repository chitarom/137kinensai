import './Event.css'
import { Link } from 'react-router-dom';



function Event() {
    


    return (
        <div className="event-con">
            <div className="title-explain">
                <h2>注目のイベント</h2>
                <p>～記念祭をもっと楽しめるイベントをご紹介～</p>
            </div>
            <div className="event-list">
                <Link to="/" className="event">
                    <p>STAGE PERFORMANCE</p>
                </Link>
            </div>

            

            
        </div>

    )
}

export default Event;