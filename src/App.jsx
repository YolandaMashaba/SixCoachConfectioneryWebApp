import { useState, useMemo } from 'react';
import {
  Search,
  MessageCircle,
  Phone,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Heart,
  Award,
  Coffee,
  Download,
  ShoppingCart,
  Trash2,
  CheckCircle,
  LoaderCircle
} from 'lucide-react';

// Contact details 
const WHATSAPP_NUMBER = '+27791901471';
const PHONE_DISPLAY = '+27 79 190 1471';
const CONTACT_EMAIL = 'zwanefistos88@gmail.com'; 

// Product catalogue (display only)
const PRODUCTS = [
  {
    id: 'c1',
    name: 'Assorted Muffins',
    category: 'Cakes',
    price: 5,
    priceOptions: [
      { label: 'Each', price: 5 },
      { label: '5lt', price: 200 },
      { label: '10lt', price: 400 },
      { label: '20lt', price: 600 }
    ],
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
    price: 3,
    priceOptions: [
      { label: 'Each', price: 3 },
      { label: '5lt', price: 320 },
      { label: '10lt', price: 650 },
      { label: '20lt', price: 995 }
    ],
    badge: 'POPULAR',
    rating: 4.8,
    reviews: 19,
    image: '/images/cake-2.jpeg',
    description: '"Melting moment" crispy biscuits.'
  },
  {
    id: 'c3',
    name: 'Banana Slices',
    category: 'Cakes',
    priceOptions: [
      { label: 'Each', price: 8 },
      { label: 'loaf', price: 100 },
      
    ],
    badge: 'NEW',
    rating: 4.7,
    reviews: 14,
    image: '/images/cake-3.jpeg',
    description: 'Freshly baked banana loaf.'
  },
  {
    id: 'c4',
    name: 'Jam Tarts',
    category: 'Cakes',
    priceOptions: [
      { label: 'Each', price: 8 },
      { label: '5lt', price: 300 },
      { label: '10lt', price: 600 },
      { label: '20lt', price: 600 }
    ],
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
    description: 'Crunchy and delicious ginger biscuits.'
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

const NAV_ITEMS = ['All Products', 'About Us'];

// Opens a WhatsApp chat. Pass a message to pre-fill it.
const openWhatsApp = (message = '') => {
  const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  const url = message
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phoneNumber}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const getProductOptions = (product) =>
  product.priceOptions ?? (Number.isFinite(product.price) ? [{ label: 'Each', price: product.price }] : []);

const getProductStartingPrice = (product) =>
  Math.min(...getProductOptions(product).map((option) => option.price));

const getTodayDate = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptionLabel, setSelectedOptionLabel] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [savedOrder, setSavedOrder] = useState(null);
  const [orderCustomer, setOrderCustomer] = useState({ name: '', contact: '', consent: false });
  const cartItemCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  const estimatedTotal = cartItems.reduce((total, item) => {
    const product = PRODUCTS.find((entry) => entry.id === item.productId);
    const option = product && getProductOptions(product).find((entry) => entry.label === item.optionLabel);
    return total + (option ? option.price * (Number(item.quantity) || 0) : 0);
  }, 0);

  const updateCartItem = (itemId, updates) => {
    setCartItems((items) => items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const addToCart = (product, optionLabel = getProductOptions(product)[0].label) => {
    const itemId = `${Date.now()}-${Math.random()}`;
    setCartItems((items) => {
      const existing = items.find((item) => item.productId === product.id && item.optionLabel === optionLabel);
      if (existing) {
        return items.map((item) =>
          item.id === existing.id ? { ...item, quantity: Math.min((Number(item.quantity) || 0) + 1, 1000) } : item
        );
      }
      return [...items, {
        id: itemId,
        productId: product.id,
        optionLabel,
        quantity: 1
      }];
    });
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedOptionLabel(getProductOptions(product)[0].label);
  };

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    ).sort((a, b) => {
      if (sortBy === 'price-low') return getProductStartingPrice(a) - getProductStartingPrice(b);
      if (sortBy === 'price-high') return getProductStartingPrice(b) - getProductStartingPrice(a);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'latest' default order
    });
  }, [searchQuery, sortBy]);

  const handleCartCheckout = async (event) => {
    event.preventDefault();
    if (cartItems.length === 0 || isSubmittingOrder) return;

    const orderItems = cartItems.map((item) => {
      const product = PRODUCTS.find((entry) => entry.id === item.productId);
      const option = getProductOptions(product).find((entry) => entry.label === item.optionLabel);
      return {
        productId: product.id,
        product: product.name,
        option: option.label,
        unitPrice: option.price,
        quantity: Number(item.quantity),
        lineTotal: option.price * Number(item.quantity)
      };
    });

    setOrderError('');
    if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      setOrderError('Firebase is not configured for this app. Add the Firebase values to .env and restart the dev server.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const { submitEnquiry } = await import('./services/enquiryService.js');
      const saved = await submitEnquiry({
        type: 'Order',
        name: orderCustomer.name.trim(),
        contact: orderCustomer.contact.trim(),
        message: 'Order submitted from the website.',
        consent: orderCustomer.consent,
        orderItems,
        preferredDate,
        preferredTime
      });
      setSavedOrder({ id: saved.id, estimatedTotal });
      setCartItems([]);
      setPreferredDate('');
      setPreferredTime('');
      setOrderCustomer({ name: '', contact: '', consent: false });
    } catch (error) {
      console.error('Unable to save customer order to Firestore:', error);
      if (error.code === 'permission-denied') {
        setOrderError('Firestore rejected this order. Check that the latest Firestore rules are deployed. Your cart has been kept.');
      } else if (error.code === 'auth/invalid-api-key') {
        setOrderError('Firebase configuration is invalid. Check the Firebase values in .env and restart the dev server. Your cart has been kept.');
      } else {
        setOrderError('We could not submit your order. Please check your connection and try again. Your cart has been kept.');
      }
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2D2B2A] font-sans antialiased">

      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="sticky top-0 z-40 bg-[#EDE7DF] border-b border-[#E2DAD0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setActiveTab('All Products')}
            >
              <img
                src="/images/logo.jpeg"
                alt="Six Coach Confectionery Logo"
                className="h-14 w-14 object-contain rounded-full shadow-xs"
              />
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search treats, cakes, muffins..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveTab('All Products');
                  }}
                  className="w-full bg-white border border-[#DDD5CA] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#8C827A]" />
              </div>
            </div>

            {/* Social & Contact Icons */}
            <div className="flex items-center space-x-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="text-[#2D2B2A] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#instagram" aria-label="Instagram" className="text-[#2D2B2A] hover:text-[#E1306C] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a
                href={`tel:${PHONE_DISPLAY.replace(/\s/g, '')}`}
                aria-label="Call us"
                className="text-[#2D2B2A] hover:text-[#B8860B] transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Open cart, ${cartItemCount} items`}
                className="relative text-[#2D2B2A] hover:text-[#C24954] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#C85A54] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar / Only All Products & About Us */}
          <nav className="flex items-center space-x-6 overflow-x-auto pb-3 pt-1 text-sm font-medium border-t border-[#E2DAD0]/60">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full transition-all ${
                  activeTab === item
                    ? 'bg-[#2D2B2A] text-white font-semibold'
                    : 'text-[#524B45] hover:text-[#2D2B2A] hover:bg-[#E2DAD0]'
                }`}
              >
                {item}
              </button>
            ))}
            <a
              href="/menu-catalogue.pdf"
              download="Six-Coach-Confectionery-Menu.pdf"
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-[#524B45] hover:text-[#2D2B2A] hover:bg-[#E2DAD0] transition-all inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download Menu PDF
            </a>
          </nav>
        </div>
      </header>

      {/* --- HERO BANNER SECTION (Shown when browsing products) --- */}
      {activeTab === 'All Products' && (
        <section className="bg-[#FAF4EC] border-b border-[#E8DFC2] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8DFC2] text-[#5C4A23]">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Home-baked in small batches
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-[#2D2B2A] leading-tight">
                Sweet treats worth the <span className="italic text-[#C85A54]">journey</span>.
              </h1>
              <p className="text-[#6B635B] text-base leading-relaxed max-w-lg">
                Six Coach Confectionery bakes cookies, cakes, muffins and coconut treats the way your favourite tin of biscuits always looked — full, fresh, and a little bit extra. Browse our range, then chat to us on WhatsApp.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('All Products');
                    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#D95B66] text-white px-6 py-3 rounded-full font-medium hover:bg-[#C24954] transition-all flex items-center shadow-sm"
                >
                  Browse our treats <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => openWhatsApp()}
                  className="bg-transparent border border-[#2D2B2A] text-[#2D2B2A] px-6 py-3 rounded-full font-medium hover:bg-[#2D2B2A] hover:text-white transition-all"
                >
                  Chat with us
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
                <p className="text-xs text-[#7A726A]">Freshly baked products made with love and care!</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      {activeTab === 'All Products' ? (
        <main id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Section Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#E2DAD0]">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#2D2B2A]">All Products</h2>
              <p className="text-sm text-[#7A726A] mt-1">
                {filteredProducts.length === 0
                  ? `Showing 0 of ${PRODUCTS.length} results`
                  : `Showing 1–${filteredProducts.length} of ${PRODUCTS.length} results`}
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
              <p className="text-lg text-[#6B635B]">No treats found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-sm font-semibold text-[#C85A54] hover:underline"
              >
                Clear search and view all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden border border-[#EAE3D9] hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
                  onClick={() => openProductDetails(product)}
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
                      <div className="text-left text-xs text-[#6B635B]">
                        <p>
                          From: <strong className="text-sm text-[#2D2B2A]">R{getProductStartingPrice(product)}</strong>
                        </p>
                        {product.priceOptions && (
                          <p>{product.priceOptions.map((option) => `${option.label} R${option.price}`).join(' · ')}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductDetails(product);
                        }}
                        className="bg-[#FAF4EC] hover:bg-[#2D2B2A] hover:text-white text-[#2D2B2A] text-xs font-semibold px-4 py-2 rounded-full transition-colors border border-[#E2DAD0]"
                      >
                        View Details
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(product);
                      }}
                      className="mt-3 w-full bg-[#2D2B2A] hover:bg-[#403D3B] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* --- ABOUT US PAGE SECTION --- */
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C85A54]">Our Story & Purpose</span>
            <h2 className="text-4xl font-serif font-bold text-[#2D2B2A]">About Six Coach Confectionery</h2>
            <div className="w-16 h-1 bg-[#C85A54] mx-auto rounded-full"></div>
          </div>

          {/* Intro Story */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EDE7DF] shadow-xs space-y-6 text-[#524B45] leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-[#F0EAE1] pb-8">
              <div className="md:col-span-1 flex justify-center">
                <img
                  src="/images/logo.jpeg"
                  alt="Six Coach Confectionery Logo"
                  className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-[#FAF4EC]"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-2xl font-serif font-bold text-[#2D2B2A]">Who Is Behind It</h3>
                <p className="text-sm">
                  <strong>Six Coach Confectionery</strong> is an independent artisanal bakery rooted in home-style craftsmanship. Founded by Letta Mthiunye. She started the business because she wanted to share the joy of homemade treats with her community. Dedicated to preserving authentic baking traditions, our team combines culinary precision with warm, personal hospitality.
                </p>
                <p className="text-sm">
                  Every muffin, biscuit tin, and celebration cake is crafted in small batches using premium ingredients, ensuring that every bite feels genuinely homemade and crafted with love.
                </p>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#EDE7DF] text-center space-y-2">
                <Coffee className="w-8 h-8 text-[#C85A54] mx-auto" />
                <h4 className="font-serif font-bold text-[#2D2B2A]">What We Do</h4>
                <p className="text-xs text-[#7A726A]">
                  We bake fresh cookies, muffins, banana loaves, marble cakes, and custom celebration cakes daily for personal treats and special events.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#EDE7DF] text-center space-y-2">
                <Heart className="w-8 h-8 text-[#C85A54] mx-auto" />
                <h4 className="font-serif font-bold text-[#2D2B2A]">Why We Exist</h4>
                <p className="text-xs text-[#7A726A]">
                  To bring back the comforting feeling of opening a full, fresh tin of biscuits—bringing people together through memorable flavors.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#EDE7DF] text-center space-y-2">
                <Award className="w-8 h-8 text-[#C85A54] mx-auto" />
                <h4 className="font-serif font-bold text-[#2D2B2A]">Our Promise</h4>
                <p className="text-xs text-[#7A726A]">
                  Uncompromised quality, zero artificial preservatives, small-batch attention, and friendly service through WhatsApp.
                </p>
              </div>
            </div>

            {/* Call to action inside About page */}
            <div className="pt-6 text-center border-t border-[#F0EAE1]">
              <h4 className="font-serif font-bold text-lg text-[#2D2B2A] mb-2">Ready to try our home-baked treats?</h4>
              <button
                onClick={() => setActiveTab('All Products')}
                className="bg-[#2D2B2A] hover:bg-[#403D3B] text-white px-8 py-3 rounded-full font-semibold text-sm transition-all shadow-sm"
              >
                Explore All Products
              </button>
            </div>
          </div>
        </main>
      )}

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <section
            className="h-full w-full max-w-xl overflow-y-auto bg-[#FBF9F5] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2DAD0] bg-[#EDE7DF] px-5 py-4 sm:px-7">
              <div>
                <h2 id="cart-title" className="font-serif text-2xl font-bold text-[#2D2B2A]">Your cart</h2>
                <p className="text-xs text-[#6B635B]">{cartItemCount} item{cartItemCount === 1 ? '' : 's'}</p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-2 text-[#2D2B2A] hover:bg-[#DDD5CA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
                {savedOrder ? (
                  <>
                    <CheckCircle className="mb-4 h-10 w-10 text-[#38734A]" />
                    <h3 className="font-serif text-xl font-bold text-[#2D2B2A]">Order request submitted</h3>
                    <p className="mt-2 text-sm text-[#6B635B]">
                      Reference: <strong>{savedOrder.id}</strong>
                    </p>
                    <p className="mt-1 text-sm text-[#6B635B]">
                      Estimated total: R{savedOrder.estimatedTotal.toFixed(2)}. The bakery will confirm availability and final pricing.
                    </p>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mb-4 h-10 w-10 text-[#A89F95]" />
                    <h3 className="font-serif text-xl font-bold text-[#2D2B2A]">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-[#6B635B]">Browse our treats and add something delicious.</p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSavedOrder(null);
                    setCartOpen(false);
                  }}
                  className="mt-5 rounded-full bg-[#2D2B2A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#403D3B]"
                >
                  Continue browsing
                </button>
              </div>
            ) : (
              <form onSubmit={handleCartCheckout} className="space-y-6 p-5 sm:p-7">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = PRODUCTS.find((entry) => entry.id === item.productId);
                    const options = getProductOptions(product);
                    const option = options.find((entry) => entry.label === item.optionLabel);

                    return (
                      <article key={item.id} className="rounded-xl border border-[#EDE7DF] bg-white p-4 shadow-sm">
                        <div className="flex items-start gap-4">
                          <img src={product.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-serif font-bold text-[#2D2B2A]">{product.name}</h3>
                              <button
                                type="button"
                                onClick={() => setCartItems((items) => items.filter((entry) => entry.id !== item.id))}
                                aria-label={`Remove ${product.name} from cart`}
                                className="rounded-full p-1.5 text-[#A13D45] hover:bg-[#FAF4EC]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor={`cart-option-${item.id}`} className="block text-xs font-medium text-[#524B45]">Size / pack</label>
                                <select
                                  id={`cart-option-${item.id}`}
                                  value={item.optionLabel}
                                  onChange={(event) => updateCartItem(item.id, { optionLabel: event.target.value })}
                                  className="mt-1 w-full rounded-lg border border-[#DDD5CA] bg-white px-2.5 py-2 text-sm text-[#2D2B2A]"
                                >
                                  {options.map((entry) => (
                                    <option key={entry.label} value={entry.label}>{entry.label} — R{entry.price}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label htmlFor={`cart-quantity-${item.id}`} className="block text-xs font-medium text-[#524B45]">Quantity</label>
                                <input
                                  id={`cart-quantity-${item.id}`}
                                  type="number"
                                  min="1"
                                  max="1000"
                                  step="1"
                                  required
                                  value={item.quantity}
                                  onChange={(event) => updateCartItem(item.id, {
                                    quantity: event.target.value === ''
                                      ? ''
                                      : Math.max(1, Math.min(1000, Number(event.target.value)))
                                  })}
                                  className="mt-1 w-full rounded-lg border border-[#DDD5CA] bg-white px-2.5 py-2 text-sm text-[#2D2B2A]"
                                />
                              </div>
                            </div>
                            <p className="mt-3 text-right text-sm text-[#6B635B]">
                              R{option.price} × {item.quantity} = <strong className="text-[#2D2B2A]">R{(option.price * item.quantity).toFixed(2)}</strong>
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cart-date" className="block text-sm font-medium text-[#2D2B2A]">Preferred date</label>
                    <input
                      id="cart-date"
                      type="date"
                      required
                      min={getTodayDate()}
                      value={preferredDate}
                      onChange={(event) => setPreferredDate(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#DDD5CA] bg-white px-3 py-2.5 text-sm text-[#2D2B2A]"
                    />
                  </div>
                  <div>
                    <label htmlFor="cart-time" className="block text-sm font-medium text-[#2D2B2A]">Preferred time</label>
                    <input
                      id="cart-time"
                      type="time"
                      required
                      value={preferredTime}
                      onChange={(event) => setPreferredTime(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#DDD5CA] bg-white px-3 py-2.5 text-sm text-[#2D2B2A]"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-[#E2DAD0] pt-4">
                  <h3 className="font-serif text-lg font-bold text-[#2D2B2A]">Your details</h3>
                  <div>
                    <label htmlFor="order-name" className="block text-sm font-medium text-[#2D2B2A]">Name</label>
                    <input
                      id="order-name"
                      type="text"
                      autoComplete="name"
                      maxLength="100"
                      required
                      value={orderCustomer.name}
                      onChange={(event) => setOrderCustomer((customer) => ({ ...customer, name: event.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-[#DDD5CA] bg-white px-3 py-2.5 text-sm text-[#2D2B2A]"
                    />
                  </div>
                  <div>
                    <label htmlFor="order-contact" className="block text-sm font-medium text-[#2D2B2A]">Phone or email</label>
                    <input
                      id="order-contact"
                      type="text"
                      autoComplete="email"
                      maxLength="150"
                      required
                      value={orderCustomer.contact}
                      onChange={(event) => setOrderCustomer((customer) => ({ ...customer, contact: event.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-[#DDD5CA] bg-white px-3 py-2.5 text-sm text-[#2D2B2A]"
                    />
                  </div>
                  <label htmlFor="order-consent" className="flex items-start gap-2 text-xs text-[#6B635B]">
                    <input
                      id="order-consent"
                      type="checkbox"
                      required
                      checked={orderCustomer.consent}
                      onChange={(event) => setOrderCustomer((customer) => ({ ...customer, consent: event.target.checked }))}
                      className="mt-0.5 accent-[#C85A54]"
                    />
                    <span>I agree to share these details so Six Coach Confectionery can respond to my order request.</span>
                  </label>
                </div>

                <div className="border-t border-[#E2DAD0] pt-4">
                  <div className="flex items-center justify-between text-lg font-bold text-[#2D2B2A]">
                    <span>Estimated total</span>
                    <span aria-live="polite">R{estimatedTotal.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#7A726A]">
                    Estimate only. The bakery will confirm availability and final pricing.
                  </p>
                  {orderError && <p role="alert" className="mt-3 text-sm text-red-700">{orderError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2D2B2A] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#403D3B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Submitting order...
                      </>
                    ) : (
                      'Submit order'
                    )}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {/* --- PRODUCT DETAILS MODAL --- */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedProduct.name}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EDE7DF]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-[#FAF6F0]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Close"
                className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full text-[#2D2B2A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {selectedProduct.badge && (
                <span className="absolute top-3 left-3 bg-[#2D2B2A] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-[#C85A54] font-semibold tracking-wider uppercase">{selectedProduct.category}</span>
                <h3 className="text-2xl font-serif font-bold text-[#2D2B2A]">{selectedProduct.name}</h3>
                <p className="text-sm text-[#6B635B] mt-1">{selectedProduct.description}</p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#F0EAE1]">
                <div>
                  {selectedProduct.priceOptions ? (
                    <>
                      <label htmlFor="detail-option" className="text-xs text-[#7A726A]">Choose size / pack</label>
                      <select
                        id="detail-option"
                        value={selectedOptionLabel}
                        onChange={(event) => setSelectedOptionLabel(event.target.value)}
                        className="mt-1 w-full bg-white border border-[#DDD5CA] rounded-lg px-3 py-2 text-sm text-[#2D2B2A]"
                      >
                        {selectedProduct.priceOptions.map((option) => (
                          <option key={option.label} value={option.label}>{option.label} — R{option.price}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-[#7A726A]">Price from</span>
                      <p className="text-2xl font-bold text-[#2D2B2A]">R{selectedProduct.price}.00</p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProduct, selectedOptionLabel);
                    setSelectedProduct(null);
                  }}
                  className="bg-[#2D2B2A] hover:bg-[#403D3B] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors flex items-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to cart
                </button>
              </div>
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
              <li><button onClick={() => setActiveTab('All Products')} className="hover:text-white transition-colors">All Products</button></li>
              <li><button onClick={() => setActiveTab('About Us')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => setCartOpen(true)} className="hover:text-white transition-colors">View Cart ({cartItemCount})</button></li>
              <li><a href="/menu-catalogue.pdf" download="Six-Coach-Confectionery-Menu.pdf" className="hover:text-white transition-colors">Download Menu PDF</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact Us</h4>
            <p className="text-xs text-[#A89F95]">WhatsApp: {PHONE_DISPLAY}</p>
            <p className="text-xs text-[#A89F95] mt-1">Email: {CONTACT_EMAIL}</p>
          </div>
        </div>
        <div className="border-t border-[#403D3B] py-4 text-center text-[11px] text-[#8C827A]">
          © {new Date().getFullYear()} Six Coach Confectionery. All rights reserved.
        </div>
      </footer>

    </div>
  );
}