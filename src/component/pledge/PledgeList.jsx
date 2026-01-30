import React, { useState } from 'react';
import './PledgeList.css';

function PledgeList({ pledges }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="pledge-list">
      <ul>
        {pledges.map((pledge, index) => (
          <li
            key={index}
            className={`pledge-item ${pledge.completed ? 'completed' : 'pending'}`}
            onClick={() => toggleExpand(index)}
          >
            <div className="pledge-item-header">
              <span className={`pledge-status ${pledge.completed ? 'status-complete' : 'status-pending'}`}>
                {pledge.completed ? 'O' : 'X'}
              </span>
              <span className="pledge-title">{pledge.title}</span>
              <span className={`pledge-expand ${expandedIndex === index ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>
            {expandedIndex === index && (
              <div className="pledge-description">
                {pledge.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PledgeList;
