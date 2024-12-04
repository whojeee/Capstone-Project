import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBookmark } from 'react-icons/fa';
import '../styles/SearchResults.css'

const SearchResults = () => {
  const { query } = useParams();  // Mengambil query pencarian dari URL
  const navigate = useNavigate();  // Untuk navigasi ke rute baru
  const [news, setNews] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(query || ''); // Set search term jika ada query di URL

  // Melakukan pencarian saat query berubah
  useEffect(() => {
    if (query) {
      axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=WGtW2ZqJNTNKKgWkoGbAMmcwLslom8f8`)
        .then(response => {
          setNews(response.data.response.docs);
        })
        .catch(() => {
          setError('Failed to load search results');
        });
    }
  }, [query]); // Menjalankan pencarian setiap kali query berubah

  // Fungsi untuk mengubah rute pencarian ketika ada input
  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah form untuk submit dan mereload halaman
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleBookmarkArticle = (articleId) => {
    if (!bookmarkedArticles.includes(articleId)) {
      setBookmarkedArticles([...bookmarkedArticles, articleId]);  // Add article to bookmarked list
    }
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Mengubah search term
          placeholder="Search news..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Tampilkan hasil pencarian */}
      <div className="search-results">
        {error && <div>{error}</div>}
        {news.length > 0 ? (
          news.map((article) => (
            <div key={article._id} className='news-card'>
              <h2>{article.headline.main}</h2>
              <p>{article.abstract}</p>
              <div className='card-buttons'>
              <a href={article.web_url} target="_blank" rel="noopener noreferrer" className='read-more'>Read More</a>
            {/* Bookmark Icon */}
            <FaBookmark
                className="bookmark-icon"
                onClick={() => handleBookmarkArticle(article._id)}
                style={{ color: bookmarkedArticles.includes(article._id) ? '#ff7f50' : '#333' }}
              />
            </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
