import { useEffect, useState } from 'react';
import './App.css';
import { FaTwitter, FaQuoteLeft } from 'react-icons/fa';
import axios, { isCancel } from 'axios';
import classNames from 'classnames';

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

    if (quote.author) {
      quote.author = quote.author.replace(', type.fit', '');
    }

    setQuote(quote);
  };

  const handleTwitterClick = () => {
    if (!quote) return;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote.text} - ${
      quote.author || 'Unknown'
    }`;
    window.open(twitterUrl, '_blank');
  };

  if (!quotes.length) {
    return <div className="loader"></div>;
  }

  return (
    <div className="quote-container">
      {quote ? (
        <>
          <div
            className={classNames('quote-text', {
              'long-quote': quote.text.length > 120,
            })}
          >
            <FaQuoteLeft />
            <span>{quote.text}</span>
          </div>
          <div className="quote-author">
            <span>{quote.author || 'Unknown'}</span>
          </div>
        </>
      ) : null}
      <div className="button-container">
        <button
          className="twitter-button"
          title="Tweet This!"
          onClick={handleTwitterClick}
        >
          <FaTwitter />
        </button>
        <button onClick={getRandomQuote}>New Quote</button>
      </div>
    </div>
  );
};

export default App;
