import React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import './VirtualizedList.css';

const VirtualizedList = ({ data }) => {
  const rowRenderer = ({ index, key, style }) => {
    const user = data[index];

    return (
        <div key={key} style={style} className="list-item">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <div className="user-info">
          <strong>{user.name}</strong> — {user.email}
        </div>
      </div>      
    );
  };

  return (
    <div style={{ height: '600px' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={data.length}
            rowHeight={40}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedList;
