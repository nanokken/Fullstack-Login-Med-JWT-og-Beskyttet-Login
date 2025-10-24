import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./components/Login/Login.jsx";
import Profile from "./components/Profile/Profile.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/protected" element={<Profile />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}