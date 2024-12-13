import React, { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import '../styles/Saved.css';

const Saved = () => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    try {
      const articles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
      console.log('Saved articles:', articles); // Debugging data
      const validArticles = articles.filter((article) => article && article._id && article.headline?.main);
      setSavedArticles(validArticles);
    } catch (error) {
      console.error("Error reading saved articles:", error);
      setSavedArticles([]);
    }
  }, []);

  const handleRemoveBookmark = (articleId) => {
    const updatedArticles = savedArticles.filter((article) => article._id !== articleId);
    setSavedArticles(updatedArticles); // Update state
    localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedArticles)); // Update localStorage
  };

  return (
    <div className="saved-page">
      <h1>Saved Articles</h1>
      <div className="news-cards">
        {savedArticles.length > 0 ? (
          savedArticles.map((article) => {
            const imageUrl =
              article.multimedia && article.multimedia.length > 0 && article.multimedia[0].url
                ? `https://static01.nyt.com/${article.multimedia[0].url}` // URL dari multimedia
                : article.image_url && article.image_url.trim() !== ""
                ? article.image_url // URL gambar tersimpan
                : `${process.env.PUBLIC_URL}/images/placeholder.jpeg`; // Placeholder default

            return (
              <div key={article._id} className="news-card">
                <div className="card-image">
                  <img
                    src={imageUrl}
                    alt={article.headline?.main || "Placeholder"}
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.jpeg`; // Placeholder jika gagal
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
                        fill: 'red', // Default outlined style
                        stroke: 'white', // Dark red outline
                        strokeWidth: '35px', // Thicker outline
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
