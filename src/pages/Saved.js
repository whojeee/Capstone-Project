import React, { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import '../styles/Saved.css';

const Saved = () => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    try {
      const articles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
      console.log('Saved articles:', articles); 
      const validArticles = articles.filter((article) => article && article._id && article.headline?.main);
      setSavedArticles(validArticles);
    } catch (error) {
      console.error("Error reading saved articles:", error);
      setSavedArticles([]);
    }
  }, []);

  const handleRemoveBookmark = (articleId) => {
    const updatedArticles = savedArticles.filter((article) => article._id !== articleId);
    setSavedArticles(updatedArticles); 
    localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles)); 
  };

  return (
    <div className="saved-page">
      <h1>Saved Articles</h1>
      <div className="news-cards">
        {savedArticles.length > 0 ? (
          savedArticles.map((article) => {
            const imageUrl =
              article.multimedia && article.multimedia.length > 0 && article.multimedia[0].url
                ? `https://static01.nyt.com/${article.multimedia[0].url}` 
                : article.image_url && article.image_url.trim() !== ""
                ? article.image_url 
                : `${process.env.PUBLIC_URL}/images/placeholder.jpeg`; 

            return (
              <div key={article._id} className="news-card">
                <div className="card-image">
                  <img
                    src={imageUrl}
                    alt={article.headline?.main || "Placeholder"}
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpeg`; 
                    }}
                  />
                </div>
                <h2>{article.headline?.main || "No headline available"}</h2>
                <p>{article.abstract || "No abstract available"}</p>
                <div className="card-buttons">
                  <a
                    href={article.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read More
                  </a>
                  <button
                    className="save-article"
                    onClick={() => handleRemoveBookmark(article._id)}
                  >
                    <FaBookmark
                      style={{
                        color: 'white',
                        fill: 'black', 
                        stroke: 'white', 
                        strokeWidth: '25px', 
                        fontSize: '20px',
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No saved articles</p>
        )}
      </div>
    </div>
  );
};

export default Saved;
