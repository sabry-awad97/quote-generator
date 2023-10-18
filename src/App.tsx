import { useEffect, useState } from 'react';
import './App.css';
import { FaTwitter } from 'react-icons/fa';
import axios, { isCancel } from 'axios';

interface IQuote {
  text: string;
  author: string | null;
}

const App = () => {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const source = axios.CancelToken.source();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data } = await axios.get<IQuote[]>(
          'https://type.fit/api/quotes',
          {
            cancelToken: source.token,
          }
        );
        setQuotes(data);
      } catch (error) {
        if (isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          throw error;
        }
      }
    };

    fetchQuotes();

    return () => {
      source.cancel('Component is unmounted');
    };
  }, [source]);

  if (!quotes.length) {
    return <div className="loader"></div>;
  }

  return (
    <div className="quote-container">
      <div className="button-container">
        <button className="twitter-button" title="Tweet This!">
          <FaTwitter />
        </button>
      </div>
    </div>
  );
};

export default App;
