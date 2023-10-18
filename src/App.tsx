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
  const [quote, setQuote] = useState<IQuote | null>(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

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
  }, []);

  const getRandomQuote = () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(quote);
  };

  if (!quotes.length) {
    return <div className="loader"></div>;
  }

  return (
    <div className="quote-container">
      <div className="button-container">
        <button
          className="twitter-button"
          title="Tweet This!"
          onClick={() => {
            if (!quote) return;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${quote.text} - ${quote.author}`;
            window.open(twitterUrl, '_blank');
          }}
        >
          <FaTwitter />
        </button>
        <button onClick={() => getRandomQuote()}>New Quote</button>
      </div>
    </div>
  );
};

export default App;
