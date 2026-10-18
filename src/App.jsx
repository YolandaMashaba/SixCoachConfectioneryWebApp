import { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  X, 
  Plus, 
  Minus, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

// Product Catalog Data matching wireframes & UI designs
const PRODUCTS = [
  {
    id: 'c1',
    name: 'Assorted Muffins',
    category: 'Cakes',
    price: 200,
    badge: 'BESTSELLER',
    rating: 4.9,
    reviews: 28,
    image: '/images/cake-1.jpeg',
    description: 'Freshly baked assorted muffins'
  },
  {
    id: 'c2',
    name: 'Butter Biscuits',
    category: 'Cakes',
    price: 320,
    badge: 'POPULAR',
    rating: 4.8,
    reviews: 19,
    image: '/images/cake-2.jpeg',
    description: '"Melting moment" crispy biscuits.'
  },
  {
    id: 'c3',
    name: 'Banana Loaf',
    category: 'Cakes',
    price: 100,
    badge: 'NEW',
    rating: 4.7,
    reviews: 14,
    image: '/images/cake-3.jpeg',
    description: 'Freshly baked banana loaf.'
  },
  {
    id: 'c4',
    name: '',
    category: 'Cakes',
    price: 300,
    badge: 'BESTSELLER',
    rating: 5.0,
    reviews: 42,
    image: '/images/cake-4.jpeg',
    description: 'Rich multi-layered sponge cake with whipped vanilla buttercream.'
  },
  {
    id: 'c5',
    name: 'Marble Cake',
    category: 'Cakes',
    price: 100,
    badge: null,
    rating: 4.9,
    reviews: 31,
    image: '/images/cake-5.jpeg',
    description: 'Freshly baked marble cake.'
  },
  {
    id: 'c6',
    name: 'Ginger Biscuits',
    category: 'Cakes',
    price: 250,
    badge: 'CUSTOM',
    rating: 4.8,
    reviews: 22,
    image: '/images/cake-6.jpeg',
    description: 'Cruncy and delicious ginger biscuits.'
  },
  {
    id: 'c7',
    name: 'Sponge Cake',
    category: 'Cakes',
    price: 300,
    badge: null,
    rating: 4.6,
    reviews: 18,
    image: '/images/cake-7.jpeg',
    description: 'Soft and delicate, yet satisfying.'
  }

];

const CATEGORIES = [
  'All Products',
  'Cakes',
  'Cupcakes',
  'Macarons',
  'Toppers',
  'Treats',
  'Corporate Orders',
  'Merchandise'
];

const CAKE_SIZE_PRICING = {
  'Standard (6 inch - Serves 8-10)': 0,
  'Medium (8 inch - Serves 14-16)': 150,
  'Large (10 inch - Serves 20-24)': 300
};

const getProductPrice = (product, customOpts = null) => {
  if (!product || product.category !== 'Cakes' || !customOpts?.size) {
    return product.price;
  }

  return product.price + (CAKE_SIZE_PRICING[customOpts.size] ?? 0);
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('Cakes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Customization options for cakes
  const [cakeSize, setCakeSize] = useState('Standard (6 inch - Serves 8-10)');
  const [flavor, setFlavor] = useState('Vanilla Buttercream');
  const [inscription, setInscription] = useState('');

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'latest' default order
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Cart operations
  const addToCart = (product, customOpts = null) => {
    const cartItemId = customOpts 
      ? `${product.id}-${customOpts.size}-${customOpts.flavor}-${customOpts.inscription}`
      : product.id;
    const itemPrice = getProductPrice(product, customOpts);

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        ...product,
        cartItemId,
        customOpts,
        quantity: 1,
        price: itemPrice
      }];
    });
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const totalCartAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Direct WhatsApp Checkout Builder
  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    
    let message = `Hello Six Coach Confectionery! \nI would like to place an order:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (x${item.quantity}) - R${item.price * item.quantity}.00\n`;
      if (item.customOpts) {
        if (item.customOpts.size) message += `   • Size: ${item.customOpts.size}\n`;
        if (item.customOpts.flavor) message += `   • Flavor: ${item.customOpts.flavor}\n`;
        if (item.customOpts.inscription) message += `   • Message: "${item.customOpts.inscription}"\n`;
      }
    });
    message += `\n*Total Amount:* R${totalCartAmount}.00\n\nPlease let me know availability and payment details!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/27821234567?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2D2B2A] font-sans antialiased">
      
      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="sticky top-0 z-40 bg-[#EDE7DF] border-b border-[#E2DAD0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedCategory('All Products')}>
              <div className="w-14 h-14 rounded-full border-2 border-[#2D2B2A] border-dashed flex flex-col items-center justify-center p-1 text-center bg-white">
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#2D2B2A] leading-none">SIX COACH</span>
                <span className="text-[7px] tracking-tight text-[#6B635B] uppercase leading-none mt-0.5">CONFECTIONERY</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search treats, cakes, macarons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#DDD5CA] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#8C827A]" />
              </div>
            </div>

            {/* Social & Cart Icons */}
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/27821234567" target="_blank" rel="noreferrer" className="text-[#2D2B2A] hover:text-[#25D366] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#instagram" className="text-[#2D2B2A] hover:text-[#E1306C] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-label="Instagram">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a href="tel:+27821234567" className="text-[#2D2B2A] hover:text-[#B8860B] transition-colors">
                <Phone className="w-5 h-5" />
              </a>

              {/* Cart Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-[#2D2B2A] text-white p-2.5 rounded-full hover:bg-[#403D3B] transition-colors flex items-center justify-center ml-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D9534F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar / Categories */}
          <nav className="flex items-center space-x-1 sm:space-x-6 overflow-x-auto pb-3 pt-1 scrollbar-none text-sm font-medium border-t border-[#E2DAD0]/60">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#2D2B2A] text-white font-semibold' 
                    : 'text-[#524B45] hover:text-[#2D2B2A] hover:bg-[#E2DAD0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* --- HERO BANNER SECTION --- */}
      <section className="bg-[#FAF4EC] border-b border-[#E8DFC2] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8DFC2] text-[#5C4A23]">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Home-baked in small batches
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-[#2D2B2A] leading-tight">
              Sweet treats worth the <span className="italic text-[#C85A54]">journey</span> — now delivered to your door.
            </h1>
            <p className="text-[#6B635B] text-base leading-relaxed max-w-lg">
              Six Coach Confectionery bakes cookies, cakes, muffins and coconut treats the way your favourite tin of biscuits always looked — full, fresh, and a little bit extra. Order for collection or nationwide delivery.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={() => setSelectedCategory('Cakes')}
                className="bg-[#D95B66] text-white px-6 py-3 rounded-full font-medium hover:bg-[#C24954] transition-all flex items-center shadow-sm"
              >
                Browse our treats <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="bg-transparent border border-[#2D2B2A] text-[#2D2B2A] px-6 py-3 rounded-full font-medium hover:bg-[#2D2B2A] hover:text-white transition-all"
              >
                Order on WhatsApp
              </button>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-2">
              <img 
                src="/images/cake-8.jpeg" 
                alt="Signature Cake"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-2 bg-white p-4 rounded-xl shadow-lg border border-[#EDE7DF] max-w-xs transform -rotate-3">
              <p className="text-xs font-semibold text-[#2D2B2A]">Freshly Baked Daily</p>
              <p className="text-xs text-[#7A726A]">Custom orders open for weddings, birthdays & special events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CATALOG CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#E2DAD0]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#2D2B2A]">{selectedCategory}</h2>
            <p className="text-sm text-[#7A726A] mt-1">
              Showing 1–{filteredProducts.length} of {PRODUCTS.length} results
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="flex items-center text-sm text-[#524B45]">
              <Filter className="w-4 h-4 mr-1.5" /> Sort by:
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#DDD5CA] rounded-lg px-3 py-1.5 text-sm text-[#2D2B2A] focus:outline-none focus:ring-1 focus:ring-[#2D2B2A]"
            >
              <option value="latest">Sort by latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#DDD5CA]">
            <p className="text-lg text-[#6B635B]">No treats found matching your selection.</p>
            <button 
              onClick={() => { setSelectedCategory('All Products'); setSearchQuery(''); }}
              className="mt-4 text-sm font-semibold text-[#C85A54] hover:underline"
            >
              Clear filters and view all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden border border-[#EAE3D9] hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image & Badge */}
                <div className="relative aspect-square overflow-hidden bg-[#FAF6F0]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#2D2B2A] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#2D2B2A] group-hover:text-[#C85A54] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#7A726A] mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                    <span className="text-sm text-[#6B635B]">
                      From: <strong className="text-base text-[#2D2B2A]">R{product.price}.00</strong>
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="bg-[#FAF4EC] hover:bg-[#2D2B2A] hover:text-white text-[#2D2B2A] text-xs font-semibold px-4 py-2 rounded-full transition-colors border border-[#E2DAD0]"
                    >
                      View Options
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- CUSTOMIZATION / PRODUCT DETAILS MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EDE7DF] animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-56 bg-[#FAF6F0]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full text-[#2D2B2A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-[#C85A54] font-semibold tracking-wider uppercase">{selectedProduct.category}</span>
                <h3 className="text-2xl font-serif font-bold text-[#2D2B2A]">{selectedProduct.name}</h3>
                <p className="text-sm text-[#6B635B] mt-1">{selectedProduct.description}</p>
              </div>

              {/* Cake Customization Controls */}
              {selectedProduct.category === 'Cakes' && (
                <div className="space-y-3 pt-2 border-t border-[#F0EAE1]">
                  <div>
                    <label className="block text-xs font-bold text-[#2D2B2A] uppercase mb-1">Select Size</label>
                    <select 
                      value={cakeSize} 
                      onChange={(e) => setCakeSize(e.target.value)}
                      className="w-full text-sm border border-[#DDD5CA] rounded-lg p-2 bg-white"
                    >
                      <option value="Standard (6 inch - Serves 8-10)">Standard (6 inch - Serves 8-10)</option>
                      <option value="Medium (8 inch - Serves 14-16)">Medium (8 inch - Serves 14-16) +R150</option>
                      <option value="Large (10 inch - Serves 20-24)">Large (10 inch - Serves 20-24) +R300</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D2B2A] uppercase mb-1">Select Sponge & Filling Flavor</label>
                    <select 
                      value={flavor} 
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full text-sm border border-[#DDD5CA] rounded-lg p-2 bg-white"
                    >
                      <option value="Vanilla Buttercream">Vanilla Buttercream & Berry Jam</option>
                      <option value="Belgian Chocolate Ganache">Rich Belgian Chocolate Ganache</option>
                      <option value="Salted Caramel Swirl">Salted Caramel & Vanilla Bean</option>
                      <option value="Red Velvet Cream Cheese">Red Velvet & Cream Cheese</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2D2B2A] uppercase mb-1">Custom Cake Board Inscription (Optional)</label>
                    <input 
                      type="text" 
                      placeholder='e.g. "Happy 30th Birthday Sarah!"'
                      value={inscription}
                      onChange={(e) => setInscription(e.target.value)}
                      className="w-full text-sm border border-[#DDD5CA] rounded-lg p-2 bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-[#F0EAE1]">
                <div>
                  <span className="text-xs text-[#7A726A]">Price</span>
                  <p className="text-2xl font-bold text-[#2D2B2A]">
                    R{selectedProduct.category === 'Cakes' ? selectedProduct.price + (CAKE_SIZE_PRICING[cakeSize] ?? 0) : selectedProduct.price}.00
                  </p>
                </div>
                <button
                  onClick={() => addToCart(selectedProduct, selectedProduct.category === 'Cakes' ? { size: cakeSize, flavor, inscription } : null)}
                  className="bg-[#2D2B2A] hover:bg-[#403D3B] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add to Shopping Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CART DRAWER OVERLAY --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-6 bg-[#EDE7DF] border-b border-[#E2DAD0] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#2D2B2A]" />
                  <h2 className="text-lg font-serif font-bold text-[#2D2B2A]">Your Shopping Cart</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#6B635B] hover:text-[#2D2B2A] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-[#7A726A]">
                    <ShoppingBag className="w-12 h-12 mx-auto text-[#DDD5CA] mb-3" />
                    <p className="text-base font-medium">Your cart is currently empty</p>
                    <p className="text-xs mt-1">Add some delicious treats to start your order!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartItemId} className="flex space-x-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE7DF]">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#2D2B2A] truncate">{item.name}</h4>
                        <p className="text-xs text-[#C85A54] font-semibold">R{item.price}.00</p>
                        
                        {item.customOpts && (
                          <div className="mt-1 text-[11px] text-[#7A726A] space-y-0.5">
                            {item.customOpts.size && <p>• {item.customOpts.size}</p>}
                            {item.customOpts.flavor && <p>• {item.customOpts.flavor}</p>}
                            {item.customOpts.inscription && <p>• "{item.customOpts.inscription}"</p>}
                          </div>
                        )}

                        <div className="flex items-center space-x-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 rounded bg-white border border-[#DDD5CA] flex items-center justify-center text-xs font-bold hover:bg-[#EDE7DF]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="w-6 h-6 rounded bg-white border border-[#DDD5CA] flex items-center justify-center text-xs font-bold hover:bg-[#EDE7DF]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#FAF7F2] border-t border-[#E2DAD0] space-y-4">
                  <div className="flex justify-between items-center text-base font-bold text-[#2D2B2A]">
                    <span>Subtotal</span>
                    <span>R{totalCartAmount}.00</span>
                  </div>
                  <p className="text-[11px] text-[#7A726A]">Taxes and delivery calculated during WhatsApp confirmation.</p>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Complete Order on WhatsApp</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-[#2D2B2A] text-[#D0C8BF] border-t border-[#403D3B] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-bold text-white mb-3">Six Coach Confectionery</h3>
            <p className="text-xs text-[#A89F95] leading-relaxed">
              Home-baked cakes, treats, and custom confections made with premium ingredients and delivered fresh.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setSelectedCategory('Cakes')} className="hover:text-white transition-colors">Custom Cakes</button></li>
              <li><button onClick={() => setSelectedCategory('Corporate Orders')} className="hover:text-white transition-colors">Corporate Orders</button></li>
              <li><button onClick={() => setSelectedCategory('Treats')} className="hover:text-white transition-colors">Baked Treats & Tins</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact & Orders</h4>
            <p className="text-xs text-[#A89F95]">WhatsApp: +27 79 190 1471</p>
            <p className="text-xs text-[#A89F95] mt-1">Email: zwanefistos88@gmail.co.za</p>
          </div>
        </div>
        <div className="border-t border-[#403D3B] py-4 text-center text-[11px] text-[#8C827A]">
          © {new Date().getFullYear()} Six Coach Confectionery. All rights reserved.
        </div>
      </footer>

    </div>
  );
}



