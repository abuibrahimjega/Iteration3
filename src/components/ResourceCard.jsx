import React from "react";
import "./ResourceCard.css";

export default function ResourceCard({ resource }) {
  return (
    <li className="resource-card">
      <a href={resource.url} target="_blank" rel="noopener noreferrer">
        {resource.title}
      </a>
    </li>
  );
}
