import Error from 'next/error';
import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Index = () => {
  const [start, setStart] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const { data } = useSWR('api/time/all', fetcher);

  const displayAmountOfTime = (start, end) => {
    const startInSeconds = new Date(start).getTime() / 1000;
    const endInSeconds = new Date(end).getTime() / 1000;

    if (startInSeconds < endInSeconds) {
      return Math.floor(Number(endInSeconds - startInSeconds));
    }
  };

  const secondsSince = (since) => {
    if (!since) return;
    const now = new Date().getTime() / 1000;
    const start = new Date(since).getTime() / 1000;

    if (now > start) {
      setTimeInSeconds(Math.floor(Number(now - start)));
    }
  };

  const stopAndSend = async (start, end) => {
    await fetch(
      `/api/time/create?start=${start}&end=${end}&description=${description}&clientName=${client}`
    );
    mutate('api/time/all');
  };

  useEffect(() => {
    if (!start) return;
    const interval = setInterval(() => {
      secondsSince(start);
    }, 1100);
    return () => clearInterval(interval);
  }, [start]);

  return (
    <>
      <h1>Time {timeInSeconds ? `: ${timeInSeconds}` : null}</h1>
      <form className="form">
        <fieldset>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(current) => setDescription(current.target.value)}
          />
          <label htmlFor="client">Client</label>
          <input
            type="text"
            id="client"
            value={client}
            onChange={(current) => setClient(current.target.value)}
          />

          <button
            type="submit"
            onClick={(evt) => {
              evt.preventDefault();
              start ? stopAndSend(start, new Date()) : setStart(new Date());
            }}
          >
            {start ? 'Stop' : 'Start'}
          </button>
        </fieldset>
      </form>
      <ul>
        {data?.map((timeEntry) => (
          <li key={timeEntry.id}>
            {`${displayAmountOfTime(timeEntry.start, timeEntry.end)} - ${
              timeEntry.description
            } - ${timeEntry.clientName}`}
          </li>
        ))}
      </ul>
      <style jsx>{`
        /* Style inputs */
        input[type='text'],
        select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        /* Style the submit button */
        input[type='submit'] {
          width: 100%;
          background-color: #4caf50;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Add a background color to the submit button on mouse-over */
        input[type='submit']:hover {
          background-color: #45a049;
        }
      `}</style>
    </>
  );
};

export default Index;
