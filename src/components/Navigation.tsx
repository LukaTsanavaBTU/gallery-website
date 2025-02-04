import { Link } from "react-router-dom";
import "./Navigation.css";

export default function Navigation({selected} : {selected: "home" | "history"}) {
  
    return (
        <nav className="page-nav">
            <ul>
                <li className={selected === "home" ? "selected" : ""}><Link to="/">Home</Link></li>
                <li className={selected === "history" ? "selected" : ""}><Link to="/history">History</Link></li>
            </ul>
        </nav>
    );
}