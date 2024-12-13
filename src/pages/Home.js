import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import { FaBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topStories, setTopStories] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8')
      .then((response) => {
        console.log(response.data.results); // Debug respons API
        setTopStories(response.data.results);
      })
      .catch(() => console.error('Failed to load top stories'));
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    setSavedArticles(saved);
  }, []);

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleSave = (article) => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    const isAlreadySaved = saved.some((savedArticle) =>
      savedArticle._id === (article.url || article._id)
    );

    if (!isAlreadySaved) {
      const standardizedArticle = {
        _id: article.url || article._id,
        headline: { main: article.title || article.headline?.main || 'No headline' },
        abstract: article.abstract || 'No abstract available',
        web_url: article.url || article.web_url,
        image_url: article.multimedia?.[0]?.url || '', // Use image if available
      };

      const updatedArticles = [...saved, standardizedArticle];
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles));
      setSavedArticles(updatedArticles);
    }
  };

  const isSaved = (article) => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
    return saved.some((savedArticle) =>
      savedArticle._id === (article.url || article._id)
    );
  };

  return (
    <div className="home-page">
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

        <h1>Top Stories</h1>
        <div className="news-cards">
          {topStories.map((article) => {
            const imageUrl = article.multimedia?.[0]?.url
              ? article.multimedia[0].url
              : `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;

            return (
              <div key={article.url} className="news-card">
                <div className="card-image">
                  <img
                    src={imageUrl}
                    alt={article.title || 'Placeholder'}
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpeg`;
                    }}
                  />
                </div>
                <h2>{article.title}</h2>
                <p>{article.abstract}</p>
                <div className="card-buttons">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read More
                  </a>
                  <button
                    className="save-article"
                    onClick={() => handleSave(article)}
                  >
                    <FaBookmark
                      style={{
                        color: isSaved(article) ? 'green' : 'black',
                        fontSize: '20px',
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
