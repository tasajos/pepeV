import React from 'react';
import './CategoryBar.css';

const categories = [
  'Alimentos', 'Bebidas', 'Carnes', 'Congelados', 'Abarrotes', 'Fiambreras',
  'Lácteos y Derivados', 'Panadería', 'Pastelería y Masas Dulces',
  'Cuidado del Bebé', 'Cuidado del Hogar', 'Cuidado Personal', 'Mesa Importada',
  'Rosas', 'Juguetería y Repostería', 'Higiene', 'Electrodomésticos'
];

const CategoryBar = () => {
  return (
    <div className="category-bar-container">
      <nav className="category-bar">
        {categories.map((category, index) => (
          <a key={index} href={`/categoria/${category.toLowerCase()}`} className="category-item">
            {category}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default CategoryBar;