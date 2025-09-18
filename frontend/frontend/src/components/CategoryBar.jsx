import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryBar.css';

const categories = [
  'Alimentos', 'Animales', 'Hogar', 'Cuidado del Bebé', 'Cuidado del Hogar', 'Cuidado Personal', 
  'Ropas', 'Juguetes', 'Higiene', 'Electrodomésticos', 'Vehiculos'
];

const CategoryBar = () => {
  return (
    <div className="category-bar-container">
      <nav className="category-bar">
        {categories.map((category, index) => (
          <Link key={index} to={`/categoria/${category.toLowerCase()}`} className="category-item">
            {category}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CategoryBar;