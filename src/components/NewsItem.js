import React from 'react';

const NewsItem = ({ item }) => {
  return (
    <div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <a href={item.url}>Read more</a>
    </div>
  );
};

export default NewsItem;
