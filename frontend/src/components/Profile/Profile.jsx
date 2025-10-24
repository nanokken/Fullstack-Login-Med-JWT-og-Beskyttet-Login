import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== "null") {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3042/protected", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    navigate("/login");
  };
  return (
    <div>
      <h2>Profile</h2>
      {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
