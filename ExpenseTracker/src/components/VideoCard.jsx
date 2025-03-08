import React from "react";
import "./VideoCard.css"; 

export default function VideoCard({ videoSrc, title, description }) {
  return (
    <div className="video-card">
      <video className="video" controls>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
