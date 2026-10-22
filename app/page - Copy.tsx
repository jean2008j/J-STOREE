'use client';
import { useState, useEffect } from 'react';

// Supabase Direct API Setup
const SUPABASE_URL = 'https://vfmisbycpufcwfuannpg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DLy0Ork86F29lTfxQfOsvw_E9JblYsA';

// Translations Dictionary
const TRANSLATIONS = {
  EN: {
    dir: 'ltr',
    banner: 'Express Delivery Across Syria 🚚 | Cash on Delivery, Syriatel Cash & Sham Cash Accepted',
    promo: '🔥 Winter Sale: Free shipping across Damascus on orders over $50!',
    heroTitle: 'J-STORE SPORTSWEAR',
    heroSub: 'Premium Athletic Apparel, Footwear & Sportswear Collection',
    searchPlaceholder: 'Search products, brands...',
    sizeGuideBtn: '📏 Size Guide',
    all: 'All Products',
    shoes: 'Footwear',
    winter: 'Winter Collection',
    summer: 'Summer Collection',
    selectSize: 'Select Size:',
    addToCart: 'Add to Cart +',
    outOfStock: 'Out of Stock',
    reviews: 'Customer Reviews',
    noReviews: 'No reviews yet.',
    writeReview: 'Write a Review:',
    yourName: 'Your Name',
    yourFeedback: 'Share your feedback...',
    submitReview: 'Submit Review',
    cartTitle: 'Your Cart',
    cartEmpty: 'Your cart is empty.',
    wishlistTitle: 'Wishlist',
    wishlistEmpty: 'No items saved in wishlist.',
    checkoutTitle: 'Checkout',
    orderConfirmed: 'Order Confirmed!',
    subtotal: 'Subtotal:',
    shipping: 'Shipping',
    total: 'Total Amount:',
    proceedCheckout: 'Proceed to Checkout →',
    confirmOrder: 'Confirm Order ✔',
    continueShopping: 'Continue Shopping',
    customerInfo: '1. Customer Information',
    fullName: 'Full Name',
    phone: 'Phone Number (e.g. 09xxxxxxxx)',
    cityLabel: 'City / Shipping Region:',
    address: 'Delivery Address',
    paymentTitle: '2. Payment Method',
    cod: 'Cash on Delivery (COD)',
    whatsapp: 'Quick Order via WhatsApp 💬',
    syriatel: 'Syriatel Cash',
    sham: 'Sham Cash',
    enterTxCode: 'Enter Transaction Code (TX Code)',
    addedCart: 'Added to Cart 🛒',
    addedWishlist: 'Added to Wishlist ♥',
    removedWishlist: 'Removed from Wishlist',
    badgeNew: 'New ✨',
    badgeBestSeller: 'Best Seller 🔥',
    sgTitle: 'Official Size Guide',
    sgFootwearTab: '👟 Footwear',
    sgOuterwearTab: '🧥 Outerwear',
    sgPantsTab: '👖 Pants & Shorts',
    sgFootLen: 'Foot Length (cm)',
    sgEuSize: 'EU Size',
    sgChest: 'Chest (cm)',
    sgWeight: 'Weight (kg)',
    sgWaist: 'Waist (inch)',
    sizeGuideFootwearDesc: 'Measure foot length from heel to longest toe in centimeters (cm):',
    sizeGuideJacketDesc: 'Outerwear size guide based on chest width and body weight:',
    sizeGuidePantsDesc: 'Pants and shorts size guide based on waist circumference:',
  },
  AR: {
    dir: 'rtl',
    banner: 'توصيل سريع لكافة المحافظات السورية 🚚 | الدفع عند الاستلام، سيرياتيل كاش وشام كاش',
    promo: '🔥 تنزيلات الشتاء: شحن مجاني داخل دمشق للطلبات فوق 50$!',
    heroTitle: 'جي ستور للألبسة الرياضية',
    heroSub: 'تشكيلة فاخرة من الأحذية والملابس الرياضية بأعلى جودة',
    searchPlaceholder: 'ابحث عن منتج، ماركة...',
    sizeGuideBtn: '📏 دليل المقاسات',
    all: 'جميع المنتجات',
    shoes: 'الأحذية',
    winter: 'التشكيلة الشتوية',
    summer: 'التشكيلة الصيفية',
    selectSize: 'اختر المقاس:',
    addToCart: 'إضافة للسلة +',
    outOfStock: 'نفذت الكمية',
    reviews: 'تقييمات الزبائن',
    noReviews: 'لا توجد تقييمات بعد.',
    writeReview: 'أضف تقييمك:',
    yourName: 'الاسم الكامل',
    yourFeedback: 'اكتب انطباعك عن المقاس والجودة...',
    submitReview: 'إرسال التقييم',
    cartTitle: 'سلة المشتريات',
    cartEmpty: 'السلة فارغة حالياً.',
    wishlistTitle: 'المفضلة',
    wishlistEmpty: 'لا توجد عناصر محفوظة بالمفضلة.',
    checkoutTitle: 'إتمام الطلب',
    orderConfirmed: 'تم تأكيد الطلب بنجاح!',
    subtotal: 'المجموع الفرعي:',
    shipping: 'الشحن',
    total: 'المجموع الكلي:',
    proceedCheckout: 'المتابعة للشراء ←',
    confirmOrder: 'تأكيد الطلب ✔',
    continueShopping: 'متابعة التسوق',
    customerInfo: '1. معلومات الزبون',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف (مثال: 09xxxxxxxx)',
    cityLabel: 'المحافظة / منطقة الشحن:',
    address: 'عنوان التوصيل التفصيلي',
    paymentTitle: '2. طريقة الدفع',
    cod: 'الدفع عند الاستلام (COD)',
    whatsapp: 'طلب سريع عبر واتساب 💬',
    syriatel: 'سيرياتيل كاش',
    sham: 'شام كاش',
    enterTxCode: 'أدخل رمز عملية التحويل (TX Code)',
    addedCart: 'تمت الإضافة للسلة 🛒',
    addedWishlist: 'تمت الإضافة للمفضلة ♥',
    removedWishlist: 'تمت الإزالة من المفضلة',
    badgeNew: 'جديد ✨',
    badgeBestSeller: 'الأكثر مبيعاً 🔥',
    sgTitle: 'دليل المقاسات الرسمي',
    sgFootwearTab: '👟 الأحذية',
    sgOuterwearTab: '🧥 الجواكيت',
    sgPantsTab: '👖 البنطالات والشورتات',
    sgFootLen: 'طول القدم (سم)',
    sgEuSize: 'النمرة (EU)',
    sgChest: 'عرض الصدر (سم)',
    sgWeight: 'الوزن التقريبي (كغ)',
    sgWaist: 'محيط الخصر (انش)',
    sizeGuideFootwearDesc: 'طريقة قياس الحذاء: قم بفياس طول القدم من الكعب إلى أطول إصبع بالسنتمتر:',
    sizeGuideJacketDesc: 'دليل مقاسات الجواكيت والكنزات حسب عرض الصدر والوزن:',
    sizeGuidePantsDesc: 'دليل مقاسات البنطالات والشورتات حسب محيط الخصر:',
  },
  FR: {
    dir: 'ltr',
    banner: 'Livraison Express en Syrie 🚚 | Paiement à la livraison, Syriatel Cash & Sham Cash',
    promo: "🔥 Solde d'Hiver: Livraison gratuite à Damas dès 50$ d'achat!",
    heroTitle: 'J-STORE SPORTSWEAR',
    heroSub: 'Collection Premium de Vêtements et Chaussures de Sport',
    searchPlaceholder: 'Rechercher un produit, une marque...',
    sizeGuideBtn: '📏 Guide des Tailles',
    all: 'Tous les Produits',
    shoes: 'Chaussures',
    winter: 'Collection Hiver',
    summer: 'Collection Été',
    selectSize: 'Sélectionner la Taille:',
    addToCart: 'Ajouter au Panier +',
    outOfStock: 'Rupture de Stock',
    reviews: 'Avis Clients',
    noReviews: 'Aucun avis pour le moment.',
    writeReview: 'Écrire un Avis:',
    yourName: 'Nom Complet',
    yourFeedback: 'Partagez votre avis...',
    submitReview: "Soumettre l'Avis",
    cartTitle: 'Votre Panier',
    cartEmpty: 'Votre panier est vide.',
    wishlistTitle: 'Favoris',
    wishlistEmpty: 'Aucun article dans les favoris.',
    checkoutTitle: 'Commander',
    orderConfirmed: 'Commande Confirmée!',
    subtotal: 'Sous-total:',
    shipping: 'Livraison',
    total: 'Montant Total:',
    proceedCheckout: 'Passer la Commande →',
    confirmOrder: 'Confirmer la Commande ✔',
    continueShopping: 'Continuer vos Achats',
    customerInfo: '1. Informations Client',
    fullName: 'Nom Complet',
    phone: 'Numéro de Téléphone',
    cityLabel: 'Ville / Région de Livraison:',
    address: 'Adresse de Livraison',
    paymentTitle: '2. Mode de Paiement',
    cod: 'Paiement à la Livraison (COD)',
    whatsapp: 'Commande Rapide via WhatsApp 💬',
    syriatel: 'Syriatel Cash',
    sham: 'Sham Cash',
    enterTxCode: 'Entrez le Code de Transaction (TX)',
    addedCart: 'Ajouté au Panier 🛒',
    addedWishlist: 'Ajouté aux Favoris ♥',
    removedWishlist: 'Retiré des Favoris',
    badgeNew: 'Nouveau ✨',
    badgeBestSeller: 'Meilleure Vente 🔥',
    sgTitle: 'Guide Officiel des Tailles',
    sgFootwearTab: '👟 Chaussures',
    sgOuterwearTab: '🧥 Vestes',
    sgPantsTab: '👖 Pantalons',
    sgFootLen: 'Longueur du Pied (cm)',
    sgEuSize: 'Taille EU',
    sgChest: 'Poitrine (cm)',
    sgWeight: 'Poids (kg)',
    sgWaist: 'Taille (pouce)',
    sizeGuideFootwearDesc: 'Mesurez la longueur du pied du talon au plus grand orteil en cm:',
    sizeGuideJacketDesc: 'Guide des tailles de vestes selon le tour de poitrine et le poids:',
    sizeGuidePantsDesc: 'Guide des tailles de pantalons selon le tour de taille:',
  }
};

// INITIAL FALLBACK PRODUCTS
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Puma Suede Classic Sneakers - Black/White',
    brand: 'Puma',
    category: 'shoes',
    price: 85,
    oldPrice: 100,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
    inStock: true,
    discountBadgeType: 'new',
    description: {
      EN: 'Puma classic suede sneakers in black/white design. Comfortable for daily walk and sports.',
      AR: 'حذاء بومبا كلاسيكي شمواه أسود بتصميم أنيق ومريح للمشي والرياضة اليومية.',
      FR: 'Baskets PUMA en daim classique noir et blanc. Confortables pour le quotidien.'
    },
    reviews: [
      { id: 1, name: 'Ahmad S.', rating: 5, comment: 'Very comfortable sneakers and fast delivery!' }
    ]
  },
  {
    id: 2,
    name: 'Classic Black Leather Oxford Shoes',
    brand: 'J-Store Selection',
    category: 'shoes',
    price: 110,
    oldPrice: 135,
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&auto=format&fit=crop&q=80',
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    inStock: true,
    discountBadgeType: null,
    description: {
      EN: 'Premium genuine leather formal oxford shoes.',
      AR: 'حذاء جلدي رسمي كلاسيكي فاخر مصمم للمناسبات والعمل.',
      FR: 'Chaussures Oxford élégantes en cuir véritable.'
    },
    reviews: []
  },
  {
    id: 3,
    name: 'Nike Air Max 270 - Essential Red',
    brand: 'Nike',
    category: 'shoes',
    price: 140,
    oldPrice: 165,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
    inStock: true,
    discountBadgeType: 'best',
    description: {
      EN: 'Air Max 270 with maximum air cushioning unit.',
      AR: 'حذاء نايكي إير ماكس بفقاعة هواء لممتص صدمات ممتاز.',
      FR: "Nike Air Max 270 avec unité d'amorti Air haute performance."
    },
    reviews: []
  },
  {
    id: 4,
    name: 'Nike Sportswear Puffer Jacket - Black',
    brand: 'Nike',
    category: 'winter',
    price: 130,
    oldPrice: 155,
    image: 'https://images.unsplash.com/photo-1610732255389-d34a3359d299?w=800&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    inStock: true,
    discountBadgeType: null,
    description: {
      EN: 'Insulated winter puffer jacket for high warmth.',
      AR: 'جاكيت شتوي منفوخ بمواد عازلة للحرارة والبرد القارس.',
      FR: "Doudoune d'hiver isolante pour une chaleur maximale."
    },
    reviews: []
  },
  {
    id: 5,
    name: 'Nike Dri-FIT Training T-Shirt - Black',
    brand: 'Nike',
    category: 'summer',
    price: 35,
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1602336494169-7e33ed92ea09?w=800&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    discountBadgeType: null,
    description: {
      EN: 'Dri-FIT breathable athletic t-shirt.',
      AR: 'تيشيرت رياضي بتكنولوجيا خفيفة ممتصة للعرق.',
      FR: 'T-shirt de sport respirant doté de la technologie Dri-FIT.'
    },
    reviews: []
  },
  {
    id: 6,
    name: 'Puma Performance Training Athletic Shorts',
    brand: 'Puma',
    category: 'summer',
    price: 28,
    oldPrice: 38,
    image: 'https://images.unsplash.com/photo-1744067188533-879ebb4121ea?w=800&auto=format&fit=crop&q=80',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: false,
    discountBadgeType: null,
    description: {
      EN: 'Lightweight shorts for intense workouts.',
      AR: 'شورت رياضي مرن ومريح للغاية للتمارين اليومية.',
      FR: "Short d'entraînement léger pour séances intenses."
    },
    reviews: []
  },
];

// Syrian Cities List
const SYRIAN_CITIES = [
  { id: 'damascus', name: { EN: 'Damascus', AR: 'دمشق', FR: 'Damas' }, fee: 0 },
  { id: 'rif_damascus', name: { EN: 'Rif Damascus', AR: 'ريف دمشق', FR: 'Rif Damas' }, fee: 1 },
  { id: 'aleppo', name: { EN: 'Aleppo', AR: 'حلب', FR: 'Alep' }, fee: 2 },
  { id: 'homs', name: { EN: 'Homs', AR: 'حمص', FR: 'Homs' }, fee: 2 },
  { id: 'hama', name: { EN: 'Hama', AR: 'حماة', FR: 'Hama' }, fee: 2 },
  { id: 'latakia', name: { EN: 'Latakia', AR: 'اللاذقية', FR: 'Lattaquié' }, fee: 2 },
  { id: 'tartous', name: { EN: 'Tartous', AR: 'طرطوس', FR: 'Tartous' }, fee: 2 },
];

export default function JStoreStore() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [lang, setLang] = useState('AR');
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  
  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeSizeGuideTab, setActiveSizeGuideTab] = useState('shoes');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const [selectedSizes, setSelectedSizes] = useState<Record<string | number, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review Form
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Checkout
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedCity, setSelectedCity] = useState(SYRIAN_CITIES[0]);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    txCode: '',
  });

  // Fetch Products from Supabase via REST API
  useEffect(() => {
    fetchSupabaseProducts();
  }, []);

  const fetchSupabaseProducts = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const formatted = data.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand || 'J-Store',
          category: p.category || 'all',
          price: p.price,
          oldPrice: p.oldPrice || null,
          image: p.image_url || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
          sizes: Array.isArray(p.sizes) ? p.sizes : (p.sizes ? p.sizes.split(',') : ['S', 'M', 'L', 'XL']),
          inStock: p.stock > 0,
          discountBadgeType: p.stock <= 3 ? 'new' : null,
          description: {
            EN: p.name,
            AR: p.name,
            FR: p.name,
          },
          reviews: p.reviews || []
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.log('Using fallback products');
    }
  };

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSizeSelect = (productId: any, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const toggleWishlist = (product: any) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(t.removedWishlist);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(t.addedWishlist);
        return [...prev, product];
      }
    });
  };

  const addToCart = (product: any) => {
    const chosenSize = selectedSizes[product.id] || (product.sizes && product.sizes[0]) || 'M';
    const cartItemId = `${product.id}-${chosenSize}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { ...product, selectedSize: chosenSize, quantity: 1, cartItemId }];
    });

    showToast(t.addedCart);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any[];
    });
  };

  const handleAddReview = (e: any) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim() || !quickViewProduct) return;

    const reviewObj = {
      id: Date.now(),
      name: newReviewName,
      rating: Number(newReviewRating),
      comment: newReviewComment,
    };

    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === quickViewProduct.id) {
        return { ...p, reviews: [reviewObj, ...(p.reviews || [])] };
      }
      return p;
    }));

    setQuickViewProduct((prev: any) => ({ ...prev, reviews: [reviewObj, ...(prev?.reviews || [])] }));
    setNewReviewName('');
    setNewReviewComment('');
    showToast('Review added!');
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + selectedCity.fee;

  // Complete Order & Push to Supabase via REST API
  const handleCompleteOrder = async (e: any) => {
    e.preventDefault();

    if (paymentMethod === 'whatsapp') {
      const itemsList = cart.map(i => `- ${i.name} (${i.selectedSize}) × ${i.quantity} = $${i.price * i.quantity}`).join('\n');
      const text = `New Order from J-STORE 🛍️\n\nName: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nCity: ${selectedCity.name[lang as keyof typeof selectedCity.name]}\nAddress: ${customerInfo.address}\n\nItems:\n${itemsList}\n\nTotal: $${totalAmount}`;
      window.open(`https://wa.me/963930000000?text=${encodeURIComponent(text)}`, '_blank');
    }

    if ((paymentMethod === 'syriatel' || paymentMethod === 'sham') && !customerInfo.txCode.trim()) {
      alert(t.enterTxCode);
      return;
    }

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify([{
          customer_name: customerInfo.name || 'Store Customer',
          phone: customerInfo.phone || '-',
          address: `${selectedCity.name['EN']}, ${customerInfo.address || '-'}`,
          total: totalAmount,
          items: cart,
          status: 'completed',
          created_at: new Date().toISOString(),
        }])
      });
    } catch (err) {
      console.log('Order processed');
    }

    setCheckoutStep('success');
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
    }, 300);
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    }`} dir={t.dir}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none">
          <div className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full shadow-2xl border border-neutral-700 animate-bounce pointer-events-auto whitespace-nowrap">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className={`${isDarkMode ? 'bg-neutral-900 text-gray-300 border-b border-neutral-800' : 'bg-black text-white'} text-xs py-2 px-4 text-center font-medium tracking-wide transition-colors`}>
        {t.banner}
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors ${
        isDarkMode ? 'bg-black/90 border-neutral-800' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl font-black tracking-tight uppercase italic">J-STORE</span>
          <span className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            SPORTSWEAR
          </span>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-md mx-3">
          <div className="relative">
            <svg className={`w-4 h-4 text-gray-400 absolute ${t.dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs py-2 rounded-full border outline-none transition ${t.dir === 'rtl' ? 'pr-9 pl-8' : 'pl-9 pr-8'} ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-white focus:border-white placeholder-gray-500' 
                  : 'bg-gray-100 border-transparent text-gray-900 focus:border-black placeholder-gray-400'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute ${t.dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold`}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className={`text-xs font-bold px-2 py-1.5 rounded-full border outline-none cursor-pointer ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-gray-100 border-gray-200 text-black'
            }`}
          >
            <option value="EN">🌐 EN</option>
            <option value="AR">🌐 العربية</option>
            <option value="FR">🌐 FR</option>
          </select>

          {/* Size Guide Trigger */}
          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className={`hidden md:block px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-gray-300 hover:bg-neutral-800' 
                : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {t.sizeGuideBtn}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className={`relative p-2.5 rounded-full transition border flex items-center justify-center ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800' 
                : 'bg-white border-gray-200 text-black hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-full transition border flex items-center justify-center ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 fill-current text-amber-400" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-full transition border flex items-center justify-center ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800' 
                : 'bg-white border-gray-200 text-black hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Featured Promo Bar */}
      <div className={`py-2 px-4 text-center text-xs font-semibold border-b ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
        {t.promo}
      </div>

      {/* Hero Banner */}
      <div className={`border-b py-8 px-6 text-center transition-colors ${
        isDarkMode ? 'bg-black border-neutral-800' : 'bg-white border-gray-200'
      }`}>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2 italic">
          {t.heroTitle}
        </h1>
        <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t.heroSub}
        </p>
      </div>

      {/* Categories Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: t.all },
            { id: 'shoes', label: t.shoes },
            { id: 'winter', label: t.winter },
            { id: 'summer', label: t.summer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === tab.id
                  ? isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                  : isDarkMode ? 'bg-neutral-900 text-gray-300 hover:bg-neutral-800 border border-neutral-800' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentSelectedSize = selectedSizes[product.id] || (product.sizes && product.sizes[0]);
            const isWishlisted = wishlist.some(item => item.id === product.id);

            return (
              <div 
                key={product.id} 
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between hover:shadow-xl transition duration-300 ${
                  isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'
                }`}
              >
                <div 
                  className={`relative aspect-square overflow-hidden p-4 flex items-center justify-center cursor-pointer ${
                    isDarkMode ? 'bg-black' : 'bg-gray-50'
                  }`}
                  onClick={() => setQuickViewProduct(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center rounded-xl hover:scale-105 transition duration-500"
                  />

                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-3 ${t.dir === 'rtl' ? 'left-3' : 'right-3'} p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:scale-110 transition z-10`}
                  >
                    <svg className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-white'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  {/* Badges */}
                  {product.discountBadgeType === 'new' && (
                    <span className={`absolute top-3 ${t.dir === 'rtl' ? 'right-3' : 'left-3'} bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md`}>
                      {t.badgeNew}
                    </span>
                  )}
                  {product.discountBadgeType === 'best' && (
                    <span className={`absolute top-3 ${t.dir === 'rtl' ? 'right-3' : 'left-3'} bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md`}>
                      {t.badgeBestSeller}
                    </span>
                  )}

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                        {t.outOfStock}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                    <h3 
                      onClick={() => setQuickViewProduct(product)}
                      className={`text-sm font-bold leading-snug mb-2 cursor-pointer hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400 text-xs">★★★★★</div>
                      <span className="text-[10px] text-gray-400">({product.reviews ? product.reviews.length : 0})</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] text-gray-400 font-medium block mb-1">{t.selectSize}</span>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes && product.sizes.map((size: string) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(product.id, size)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition ${
                              currentSelectedSize === size
                                ? isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                                : isDarkMode ? 'bg-black text-gray-300 border-neutral-800 hover:bg-neutral-800' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>${product.price}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">${product.oldPrice}</span>
                      )}
                    </div>

                    <button
                      disabled={!product.inStock}
                      onClick={() => addToCart(product)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                        product.inStock
                          ? isDarkMode ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'
                          : 'bg-neutral-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.inStock ? t.addToCart : t.outOfStock}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* CART DRAWER MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className={`w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto ${
            isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-gray-900'
          }`}>
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-6">
                <h3 className="font-extrabold text-base">
                  {checkoutStep === 'cart' && t.cartTitle}
                  {checkoutStep === 'checkout' && t.checkoutTitle}
                  {checkoutStep === 'success' && t.orderConfirmed}
                </h3>
                <button onClick={closeDrawer} className="p-1 rounded-full hover:bg-neutral-800">✕</button>
              </div>

              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-xs text-center py-12 text-gray-500">{t.cartEmpty}</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.cartItemId} className="flex justify-between items-center text-xs border-b border-neutral-800 pb-3">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-gray-400">${item.price} × {item.quantity} ({item.selectedSize})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="px-2 py-0.5 bg-neutral-800 rounded font-bold">-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="px-2 py-0.5 bg-neutral-800 rounded font-bold">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {checkoutStep === 'checkout' && (
                <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold block mb-1">{t.fullName}</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">{t.phone}</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">{t.cityLabel}</label>
                    <select
                      value={selectedCity.id}
                      onChange={(e) => {
                        const city = SYRIAN_CITIES.find(c => c.id === e.target.value);
                        if (city) setSelectedCity(city);
                      }}
                      className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white"
                    >
                      {SYRIAN_CITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name[lang as keyof typeof c.name]} ({c.fee === 0 ? 'مجاني' : `$${c.fee}`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">{t.address}</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="font-bold block mb-2">{t.paymentTitle}</label>
                    <div className="space-y-2">
                      {[
                        { id: 'cod', label: t.cod },
                        { id: 'whatsapp', label: t.whatsapp },
                        { id: 'syriatel', label: t.syriatel },
                        { id: 'sham', label: t.sham },
                      ].map((pm) => (
                        <label key={pm.id} className="flex items-center gap-2 border border-neutral-800 p-2.5 rounded-xl cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value={pm.id}
                            checked={paymentMethod === pm.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <span>{pm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {(paymentMethod === 'syriatel' || paymentMethod === 'sham') && (
                    <div>
                      <label className="font-bold block mb-1">{t.enterTxCode}</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.txCode}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, txCode: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white font-mono"
                      />
                    </div>
                  )}
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                  <h4 className="font-bold text-lg">{t.orderConfirmed}</h4>
                  <div className="p-4 rounded-xl border border-neutral-800 text-left text-xs space-y-1">
                    <p className="text-gray-400">Payment: <strong className="text-white uppercase">{paymentMethod}</strong></p>
                    {customerInfo.txCode && <p className="text-gray-400">TX Code: <strong className="font-mono text-white">{customerInfo.txCode}</strong></p>}
                    <p className="text-gray-400">Total: <strong className="text-white">${totalAmount}</strong></p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-3">
              {checkoutStep === 'cart' && (
                <>
                  <div className="flex justify-between font-black text-sm">
                    <span>{t.total}</span>
                    <span>${subtotal}</span>
                  </div>
                  <button
                    disabled={cart.length === 0}
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl text-xs disabled:opacity-50"
                  >
                    {t.proceedCheckout}
                  </button>
                </>
              )}

              {checkoutStep === 'checkout' && (
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full py-3 bg-white text-black font-bold rounded-xl text-xs"
                >
                  {t.confirmOrder}
                </button>
              )}

              {checkoutStep === 'success' && (
                <button
                  onClick={() => {
                    setCart([]);
                    closeDrawer();
                  }}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl text-xs"
                >
                  {t.continueShopping}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER MODAL */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className={`w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto ${
            isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-gray-900'
          }`}>
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-6">
                <h3 className="font-extrabold text-base">{t.wishlistTitle}</h3>
                <button onClick={() => setIsWishlistOpen(false)} className="p-1 rounded-full hover:bg-neutral-800">✕</button>
              </div>

              <div className="space-y-4">
                {wishlist.length === 0 ? (
                  <p className="text-xs text-center py-12 text-gray-500">{t.wishlistEmpty}</p>
                ) : (
                  wishlist.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs border-b border-neutral-800 pb-3">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-gray-400">${item.price}</p>
                      </div>
                      <button onClick={() => addToCart(item)} className="px-3 py-1.5 bg-white text-black font-bold rounded-lg text-[10px]">
                        {t.addToCart}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW & REVIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-3xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase">{quickViewProduct.brand}</span>
              <button onClick={() => setQuickViewProduct(null)} className="p-1 rounded-full hover:bg-neutral-800 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-64 object-cover rounded-2xl" />
              <div className="space-y-3">
                <h2 className="font-black text-lg">{quickViewProduct.name}</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {quickViewProduct.description?.[lang as keyof typeof quickViewProduct.description] || quickViewProduct.name}
                </p>
                <div className="text-xl font-black">${quickViewProduct.price}</div>
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl text-xs"
                >
                  {t.addToCart}
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-neutral-800 pt-6">
              <h3 className="font-bold text-sm mb-4">{t.reviews}</h3>
              <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
                {quickViewProduct.reviews && quickViewProduct.reviews.length > 0 ? (
                  quickViewProduct.reviews.map((r: any) => (
                    <div key={r.id} className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">{r.name}</span>
                        <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-gray-300">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">{t.noReviews}</p>
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <h4 className="font-bold">{t.writeReview}</h4>
                <input
                  type="text"
                  placeholder={t.yourName}
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white"
                />
                <textarea
                  placeholder={t.yourFeedback}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-800 bg-black text-white h-20"
                ></textarea>
                <button type="submit" className="px-4 py-2 bg-neutral-800 text-white font-bold rounded-xl">
                  {t.submitReview}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-3xl p-6 shadow-2xl border ${
            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-base">{t.sgTitle}</h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 rounded-full hover:bg-neutral-800 font-bold">✕</button>
            </div>

            <div className="flex gap-2 mb-6">
              {[
                { id: 'shoes', label: t.sgFootwearTab },
                { id: 'jackets', label: t.sgOuterwearTab },
                { id: 'pants', label: t.sgPantsTab },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSizeGuideTab(tab.id)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                    activeSizeGuideTab === tab.id ? 'bg-white text-black border-white' : 'bg-black text-gray-400 border-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs space-y-4">
              {activeSizeGuideTab === 'shoes' && (
                <>
                  <p className="text-gray-400">{t.sizeGuideFootwearDesc}</p>
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 font-bold">
                        <th className="p-2">{t.sgEuSize}</th>
                        <th className="p-2">{t.sgFootLen}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-gray-300">
                      <tr><td className="p-2 font-bold">40</td><td className="p-2">25.0 cm</td></tr>
                      <tr><td className="p-2 font-bold">41</td><td className="p-2">25.5 cm</td></tr>
                      <tr><td className="p-2 font-bold">42</td><td className="p-2">26.5 cm</td></tr>
                      <tr><td className="p-2 font-bold">43</td><td className="p-2">27.5 cm</td></tr>
                      <tr><td className="p-2 font-bold">44</td><td className="p-2">28.0 cm</td></tr>
                    </tbody>
                  </table>
                </>
              )}

              {activeSizeGuideTab === 'jackets' && (
                <>
                  <p className="text-gray-400">{t.sizeGuideJacketDesc}</p>
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 font-bold">
                        <th className="p-2">Size</th>
                        <th className="p-2">{t.sgChest}</th>
                        <th className="p-2">{t.sgWeight}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-gray-300">
                      <tr><td className="p-2 font-bold">M</td><td className="p-2">96 - 102 cm</td><td className="p-2">60 - 70 kg</td></tr>
                      <tr><td className="p-2 font-bold">L</td><td className="p-2">103 - 108 cm</td><td className="p-2">70 - 80 kg</td></tr>
                      <tr><td className="p-2 font-bold">XL</td><td className="p-2">109 - 114 cm</td><td className="p-2">80 - 90 kg</td></tr>
                    </tbody>
                  </table>
                </>
              )}

              {activeSizeGuideTab === 'pants' && (
                <>
                  <p className="text-gray-400">{t.sizeGuidePantsDesc}</p>
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 font-bold">
                        <th className="p-2">Size</th>
                        <th className="p-2">{t.sgWaist}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-gray-300">
                      <tr><td className="p-2 font-bold">M</td><td className="p-2">30 - 32 inch</td></tr>
                      <tr><td className="p-2 font-bold">L</td><td className="p-2">33 - 34 inch</td></tr>
                      <tr><td className="p-2 font-bold">XL</td><td className="p-2">36 - 38 inch</td></tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}