import './App.css';
import { FaTwitter } from 'react-icons/fa';

const App = () => {
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
