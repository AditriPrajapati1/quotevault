import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [quote, setQuote] = useState(null);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const API = import.meta.env.VITE_API_URL;

  const getRandom = () => {
    axios.get(`${API}/quotes/random`).then(res => setQuote(res.data));
  };

  useEffect(() => { getRandom(); }, []);

  const submitQuote = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(`${API}/quotes`, { text, author });
    setText(''); setAuthor('');
    getRandom();
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>QuoteVault</h1>
      {quote && (
        <blockquote style={{ fontSize: '1.2em' }}>
          "{quote.text}" <br /> — {quote.author || 'Anonymous'}
        </blockquote>
      )}
      <button onClick={getRandom}>New Quote</button>
      <hr />
      <form onSubmit={submitQuote}>
        <input placeholder="Your quote" value={text} onChange={e => setText(e.target.value)} /><br /><br />
        <input placeholder="Author (optional)" value={author} onChange={e => setAuthor(e.target.value)} /><br /><br />
        <button type="submit">Add Quote</button>
      </form>
    </div>
  );
}

export default App;