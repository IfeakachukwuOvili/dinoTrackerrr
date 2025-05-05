import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#98FB98", // Jurassic jungle green
        backgroundImage: "url('https://www.publicdomainpictures.net/pictures/300000/nahled/prehistoric-jungle.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#8B0000", // Lava red
          fontSize: "30px",
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        🦖 Welcome, Brave Explorer!
      </h1>
      <p
        style={{
          color: "#4B0082", // Deep jungle purple
          fontSize: "18px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "10px",
          borderRadius: "6px",
        }}
      >
        Manage your resources like a true dinosaur leader! 🌿💰
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff5e1", // Fossilized parchment color
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
          width: "300px",
          border: "4px solid #8B4513", // Wooden border
        }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#8B4513", // Rocky brown
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease, transform 0.1s",
            width: "100%",
            marginBottom: "12px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5A3310")} // Darker brown on hover
          onMouseOut={(e) => (e.target.style.backgroundColor = "#8B4513")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          🪨 Enter the Lost World (Log In)
        </button>

        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#556B2F", 
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease, transform 0.1s",
            width: "100%",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#3D4A1A")} // Darker green on hover
          onMouseOut={(e) => (e.target.style.backgroundColor = "#556B2F")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          🌿 Join the Tribe (Sign Up)
        </button>
      </div>
    </div>
  );
}

export default HomePage;
