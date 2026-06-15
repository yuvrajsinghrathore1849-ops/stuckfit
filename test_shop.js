const products = [
  { category: 'men', name: 'Minimalist Cotton T-Shirt', brand: 'Stuckfit', price: 2800 },
  { category: 'women', name: 'Linen Blend Trousers', brand: 'Stuckfit', price: 7120 },
];
let category = 'men';
let searchQuery = '';
let sortOption = 'newest';

let result = products;

try {
  if (category && category !== 'all' && category !== 'new') {
    result = result.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  } else if (category === 'new') {
    result = result.filter(p => p.isNew);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(p => 
      (p.name && p.name.toLowerCase().includes(query)) || 
      (p.brand && p.brand.toLowerCase().includes(query))
    );
  }

  switch(sortOption) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'popularity':
      result.sort((a, b) => b.reviews - a.reviews);
      break;
    case 'newest':
    default:
      result.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
      break;
  }
  console.log("Success! Result length:", result.length);
} catch (e) {
  console.error("FATAL ERROR:", e);
}
