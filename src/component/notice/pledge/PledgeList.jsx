import React, { useState } from 'react';
import './PledgeList.css';

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 9l7 7 7-7" />
  </svg>
);

function PledgeList({ pledges }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ul className="pledge-list">
      {pledges.map((pledge, index) => {
        const expanded = expandedIndex === index;
        return (
          <li
            key={pledge.id ?? index}
            className={`pledge-item ${pledge.completed ? 'completed' : 'pending'}`}
          >
            <button
              type="button"
              className="pledge-item-button"
              onClick={() => toggleExpand(index)}
              aria-expanded={expanded}
            >
              <span className="pledge-status">
                {pledge.completed && <CheckIcon />}
                <span className="sr-only">{pledge.completed ? '이행 완료' : '진행 중'}</span>
              </span>
              <span className="pledge-title">{pledge.title}</span>
              <span className={`pledge-expand ${expanded ? 'expanded' : ''}`}>
                <ChevronIcon />
              </span>
            </button>
            {expanded && <p className="pledge-description">{pledge.description}</p>}
          </li>
        );
      })}
    </ul>
  );
}

export default PledgeList;
