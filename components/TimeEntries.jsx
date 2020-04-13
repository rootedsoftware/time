import Router from 'next/router';
import React from 'react';

const TimeEntries = ({ time }) => {
  const userName = time.user ? time.user.name : 'Unknown author';
  return (
    <div onClick={() => Router.push('/t/[id]', `/t/${time.id}`)}>
      <small>By {userName}</small>
      <h2>{time.start}</h2>
      <h2>{time.end}</h2>

      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default TimeEntries;
