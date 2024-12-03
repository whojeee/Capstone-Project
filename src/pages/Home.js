import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBookmark } from 'react-icons/fa'; // Using FaBookmark icon
import { useNavigate } from 'react-router-dom'; // for navigation

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [news, setNews] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);

  const navigate = useNavigate(); // hook for navigation

  useEffect(() => {
    setLoading(true);
    axios.get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
      .then(response => {
        setTopStories(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load top stories');
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    setLoading(true);

    // Redirect to the /search route
    navigate(`/search?query=${searchTerm}`);

    // Fetching results when user searches
    axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8`)
      .then(response => {
        setNews(response.data.response.docs);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching news!');
        setLoading(false);
      });
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleSave = (article) => {
    // Save article only if it's not already saved
    if (!isSaved(article)) {
      setSavedArticles(prev => [...prev, article]);
    }
  };

  const isSaved = (article) => {
    return savedArticles.some(saved => saved._id === article._id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search news..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h1>{news.length > 0 ? 'Search Results' : 'Top Stories'}</h1>
      <div className="news-cards">
        {news.length > 0 ? (
          news.map((article) => (
            <div key={article._id} className="news-card">
              <h2>{article.headline.main}</h2>
              <p>{truncateText(article.abstract, 150)}</p>
              <div className="card-buttons">
                <a href={article.web_url} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read More
                </a>
                <button
                  className="save-article"
                  onClick={() => handleSave(article)}
                  disabled={isSaved(article)}
                >
                  <FaBookmark
                    style={{
                      color: isSaved(article) ? 'black' : 'white', // Color change when saved
                      fontSize: '20px',
                    }}
                  />
                </button>
              </div>
            </div>
          ))
        ) : (
          topStories.map((article) => (
            <div key={article.url} className="news-card">
              <h2>{article.title}</h2>
              <p>{truncateText(article.abstract, 150)}</p>
              <div className="card-buttons">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read More
                </a>
                <button
                  className="save-article"
                  onClick={() => handleSave(article)}
                  disabled={isSaved(article)}
                >
                  <FaBookmark
                    style={{
                      color: isSaved(article) ? 'black' : 'white', // Color change when saved
                      fontSize: '20px',
                    }}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
