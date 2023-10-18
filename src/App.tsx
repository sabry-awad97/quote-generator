import { useEffect, useState } from 'react';
import './App.css';
import { FaTwitter, FaQuoteLeft } from 'react-icons/fa';
import axios, { isCancel } from 'axios';
import styled, { keyframes } from 'styled-components';

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
    return <Loader />;
  }

  return (
    <QuoteContainer>
      {quote ? (
        <>
          <QuoteText className={quote.text.length > 120 ? 'long-quote' : ''}>
            <FaQuoteLeft className="quote-icon" />
            <span>{quote.text}</span>
          </QuoteText>
          <QuoteAuthor>
            <span>{quote.author || 'Unknown'}</span>
          </QuoteAuthor>
        </>
      ) : null}
      <ButtonContainer className="button-container">
        <Button
          className="twitter-button"
          title="Tweet This!"
          onClick={handleTwitterClick}
        >
          <FaTwitter className="twitter-icon" />
        </Button>
        <Button onClick={getRandomQuote}>New Quote</Button>
      </ButtonContainer>
    </QuoteContainer>
  );
};

export default App;

const QuoteContainer = styled.div`
  width: auto;
  max-width: 900px;
  padding: 20px 30px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 10px 10px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 1000px) {
    margin: auto 10px;
  }
`;

const QuoteText = styled.div`
  font-size: 2.75rem;

  &.long-quote {
    font-size: 2rem;
  }

  .quote-icon {
    font-size: 4rem;
  }

  @media screen and (max-width: 1000px) {
    font-size: 2.5rem;
  }
`;

const QuoteAuthor = styled.div`
  margin-top: 15px;
  font-size: 2rem;
  font-weight: 400;
  font-style: italic;
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.div`
  cursor: pointer;
  font-size: 1.2rem;
  height: 2.5rem;
  border: none;
  border-radius: 10px;
  color: #fff;
  background-color: #333;
  outline: none;
  padding: 0.5rem 1.8rem 0.5rem 1.8rem;
  box-shadow: 0 0.3rem rgba(121, 121, 121, 0.65);

  &:hover {
    filter: brightness(110%);
  }

  &:active {
    transform: translate(0, 0.3rem);
    box-shadow: 0 0.1rem rgba(255, 255, 255, 0.65);
  }

  .twitter-button:hover {
    color: #38a1f3;
  }

  .twitter-icon {
    font-size: 1.5rem;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #333;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
`;
