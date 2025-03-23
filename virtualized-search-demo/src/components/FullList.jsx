import React from 'react';
import './VirtualizedList.css';

const FullList = ({ data }) => {
  return (
    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
      {data.map((user) => (
        <div key={user.id} className="list-item">
          <img src={user.avatar} alt={user.name} className="avatar" />
          <div className="user-info">
            <strong>{user.name}</strong> — {user.email}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FullList;
