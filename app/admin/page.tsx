'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  BarChart3, 
  Plus, 
  Search, 
  Upload, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  X, 
  Printer, 
  CheckCircle2,
  Heart,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  AlertTriangle,
  Users,
  CreditCard,
  FileSpreadsheet,
  Check,
  Edit,
  DollarSign,
  Lock,
  LogOut
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vfmisbycpufcwfuannpg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DLy0Ork86F29lTfxQfOsvw_E9JblYsA';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_STORE_KEY = 'jstore_admin_pw';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderSubTab, setOrderSubTab] = useState<'pending' | 'completed'>('pending');

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedPosCategory, setSelectedPosCategory] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string | number, string>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [showPrintPrompt, setShowPrintPrompt] = useState(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [deletingOrderIds, setDeletingOrderIds] = useState<number[]>([]);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editCostPrice, setEditCostPrice] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('hoodies');
  const [editSizesStock, setEditSizesStock] = useState<Record<string, number>>({});
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (messageEn: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message: messageEn, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ 
    name: '', 
    phone: '', 
    address: 'In-Store', 
    paymentMethod: 'Cash',
    txCode: ''
  });

  const [pName, setPName] = useState('');
  const [pCostPrice, setPCostPrice] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pCategory, setPCategory] = useState('hoodies');
  
  const [pSizesStock, setPSizesStock] = useState<Record<string, number>>({});

  // Private section: change-password form
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [isChangingPw, setIsChangingPw] = useState(false);

  // Admin login gate
  const [authState, setAuthState] = useState<'checking' | 'out' | 'in'>('checking');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [admOld, setAdmOld] = useState('');
  const [admNew, setAdmNew] = useState('');
  const [admConfirm, setAdmConfirm] = useState('');
  const [isChangingAdm, setIsChangingAdm] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(ADMIN_STORE_KEY) || sessionStorage.getItem(ADMIN_STORE_KEY);
    } catch (err) {}

    if (!saved) {
      setAuthState('out');
      return;
    }

    supabase.rpc('verify_admin_password', { p: saved }).then(({ data, error }) => {
      if (!error && data === true) {
        setAuthState('in');
      } else {
        try {
          localStorage.removeItem(ADMIN_STORE_KEY);
          sessionStorage.removeItem(ADMIN_STORE_KEY);
        } catch (err) {}
        setAuthState('out');
      }
    });
  }, []);

  const handleAdminLogin = async (e: any) => {
    e.preventDefault();
    if (!loginPassword) return;

    setIsLoggingIn(true);
    setLoginError(null);
    const { data, error } = await supabase.rpc('verify_admin_password', { p: loginPassword });
    setIsLoggingIn(false);

    if (!error && data === true) {
      try {
        (rememberMe ? localStorage : sessionStorage).setItem(ADMIN_STORE_KEY, loginPassword);
      } catch (err) {}
      setLoginPassword('');
      setAuthState('in');
    } else if (error) {
      setLoginError('Could not reach the login service. Did you run the admin SQL setup?');
    } else {
      setLoginError('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_STORE_KEY);
      sessionStorage.removeItem(ADMIN_STORE_KEY);
    } catch (err) {}
    setAuthState('out');
  };

  const handleChangeAdminPassword = async (e: any) => {
    e.preventDefault();

    if (admNew.length < 4) {
      showToast('New password must be at least 4 characters', 'error');
      return;
    }
    if (admNew !== admConfirm) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }

    setIsChangingAdm(true);
    const { data, error } = await supabase.rpc('change_admin_password', { old_pw: admOld, new_pw: admNew });
    setIsChangingAdm(false);

    if (!error && data === true) {
      try {
        if (localStorage.getItem(ADMIN_STORE_KEY)) localStorage.setItem(ADMIN_STORE_KEY, admNew);
        if (sessionStorage.getItem(ADMIN_STORE_KEY)) sessionStorage.setItem(ADMIN_STORE_KEY, admNew);
      } catch (err) {}
      setAdmOld('');
      setAdmNew('');
      setAdmConfirm('');
      showToast('🔑 Admin login password changed');
    } else if (!error) {
      showToast('Current password is incorrect', 'error');
    } else {
      showToast('Could not change password (did you run the admin SQL setup?)', 'error');
    }
  };

  const [imageFile, setImageFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [currentDateTime, setCurrentDateTime] = useState('');
  const [currentMonthInfo, setCurrentMonthInfo] = useState({ month: 0, year: 2026 });

  useEffect(() => {
    const now = new Date();
    setCurrentDateTime(now.toLocaleString());
    setCurrentMonthInfo({ month: now.getMonth(), year: now.getFullYear() });
  }, []);

  const getAvailableSizes = (category: string) => {
    if (category === 'shoes') {
      return ['38', '39', '40', '41', '42', '43', '44', '45', '46'];
    }
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  };

  const handleCategoryChange = (newCat: string) => {
    setPCategory(newCat);
    setPSizesStock({});
  };

  const handleEditCategoryChange = (newCat: string) => {
    setEditCategory(newCat);
    setEditSizesStock({});
  };

  const handleSizeStockChange = (size: string, qtyStr: string) => {
    const qty = parseInt(qtyStr) || 0;
    setPSizesStock(prev => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[size];
      } else {
        updated[size] = qty;
      }
      return updated;
    });
  };

  const handleEditSizeStockChange = (size: string, qtyStr: string) => {
    const qty = parseInt(qtyStr) || 0;
    setEditSizesStock(prev => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[size];
      } else {
        updated[size] = qty;
      }
      return updated;
    });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchProducts(), fetchOrders()]);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    setIsRefreshingOrders(true);
    setSelectedOrderIds([]);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setOrders(data);
    } else if (error) {
      console.log('Error fetching orders:', error.message);
    }
    setTimeout(() => {
      setIsRefreshingOrders(false);
    }, 600);
  };

  const calculateAnalytics = () => {
    const currentMonth = currentMonthInfo.month;
    const currentYear = currentMonthInfo.year;
    const now = currentDateTime ? new Date(currentDateTime) : new Date();

    let todaySales = 0;
    let yesterdaySales = 0;
    let currentMonthSales = 0;
    let previousMonthSales = 0;
    let totalEstimatedProfit = 0;

    const productSalesMap: Record<string, { qty: number; revenue: number }> = {};
    const customerMap: Record<string, { name: string; phone: string; ordersCount: number; totalSpent: number }> = {};
    const paymentMethodsMap: Record<string, number> = { Cash: 0, 'Syriatel Cash': 0, 'Sham Cash': 0 };

    const daysInMonthMap: Record<number, number> = {};
    const monthsInYearMap: Record<number, number> = {};

    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= totalDaysInMonth; day++) {
      daysInMonthMap[day] = 0;
    }
    for (let m = 0; m < 12; m++) {
      monthsInYearMap[m] = 0;
    }

    orders.forEach((o) => {
      const orderDate = o.created_at ? new Date(o.created_at) : new Date();
      const orderTotal = Number(o.totals ?? o.total) || 0;

      const isToday = orderDate.getDate() === now.getDate() && 
                      orderDate.getMonth() === now.getMonth() && 
                      orderDate.getFullYear() === now.getFullYear();

      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = orderDate.getDate() === yesterday.getDate() && 
                          orderDate.getMonth() === yesterday.getMonth() && 
                          orderDate.getFullYear() === yesterday.getFullYear();

      if (isToday) todaySales += orderTotal;
      if (isYesterday) yesterdaySales += orderTotal;

      if (orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth) {
        currentMonthSales += orderTotal;
        const dayNum = orderDate.getDate();
        daysInMonthMap[dayNum] = (daysInMonthMap[dayNum] || 0) + orderTotal;
      }

      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      if (orderDate.getFullYear() === prevYear && orderDate.getMonth() === prevMonth) {
        previousMonthSales += orderTotal;
      }

      if (orderDate.getFullYear() === currentYear) {
        const monthNum = orderDate.getMonth();
        monthsInYearMap[monthNum] = (monthsInYearMap[monthNum] || 0) + orderTotal;
      }

      const pm = o.payment_method || 'Cash';
      if (pm.includes('Syriatel Cash')) {
        paymentMethodsMap['Syriatel Cash'] = (paymentMethodsMap['Syriatel Cash'] || 0) + 1;
      } else if (pm.includes('Sham Cash')) {
        paymentMethodsMap['Sham Cash'] = (paymentMethodsMap['Sham Cash'] || 0) + 1;
      } else {
        paymentMethodsMap['Cash'] = (paymentMethodsMap['Cash'] || 0) + 1;
      }

      const cName = o.customer_name || 'General';
      const cPhone = o.phone || '-';
      const cKey = `${cName}-${cPhone}`;
      if (!customerMap[cKey]) {
        customerMap[cKey] = { name: cName, phone: cPhone, ordersCount: 0, totalSpent: 0 };
      }
      customerMap[cKey].ordersCount += 1;
      customerMap[cKey].totalSpent += orderTotal;

      if (Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          const itemPName = item.name || 'Unknown Product';
          const qty = Number(item.qty) || 1;
          const revenue = (Number(item.price) || 0) * qty;

          const matchedProduct = products.find(p => p.id === item.id || p.name === item.name);
          const costPrice = Number(item.cost_price) || Number(matchedProduct?.cost_price) || 0;
          const sellingPrice = Number(item.price) || 0;
          
          totalEstimatedProfit += (sellingPrice - costPrice) * qty;

          if (!productSalesMap[itemPName]) {
            productSalesMap[itemPName] = { qty: 0, revenue: 0 };
          }
          productSalesMap[itemPName].qty += qty;
          productSalesMap[itemPName].revenue += revenue;
        });
      }
    });

    const productSalesList = Object.entries(productSalesMap).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.qty - a.qty);

    const topProduct = productSalesList.length > 0 ? productSalesList[0] : null;
    const leastProduct = productSalesList.length > 0 ? productSalesList[productSalesList.length - 1] : null;

    const topCustomersList = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    let maxDay = 1;
    let maxDaySales = 0;
    Object.entries(daysInMonthMap).forEach(([day, val]) => {
      if (val > maxDaySales) {
        maxDaySales = val;
        maxDay = Number(day);
      }
    });

    const lowStockProducts = products.filter(p => {
      let totalStock = 0;
      if (p.sizes_stock && typeof p.sizes_stock === 'object') {
        totalStock = Object.values(p.sizes_stock).reduce((sum: any, val: any) => sum + (Number(val) || 0), 0);
      } else {
        totalStock = Number(p.stock) || 0;
      }
      return totalStock <= 2;
    });

    const totalSalesSum = orders.reduce((s, o) => s + (Number(o.totals ?? o.total) || 0), 0);

    return {
      todaySales,
      yesterdaySales,
      currentMonthSales,
      previousMonthSales,
      topProduct,
      leastProduct,
      daysInMonthMap,
      monthsInYearMap,
      maxDay,
      maxDaySales,
      productSalesList,
      topCustomersList,
      paymentMethodsMap,
      lowStockProducts,
      totalEstimatedProfit,
      totalSalesSum
    };
  };

  const analytics = calculateAnalytics();

  const exportToExcelCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Order ID,Customer Name,Phone,Payment Method,Total Amount,Status,Date\r\n";
    orders.forEach(o => {
      const row = [o.id, `"${o.customer_name || 'General'}"`, o.phone || '-', `"${o.payment_method || 'Cash'}"`, o.totals ?? o.total, o.status || 'pending', `"${o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}"`];
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `J-Store_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales report exported successfully!');
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      showToast(`Order #${orderId} status updated successfully`);
    } else {
      showToast('Failed to update order status', 'error');
    }
    setTimeout(() => {
      setUpdatingOrderId(null);
    }, 400);
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;

    setDeletingOrderIds([orderId]);

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (!error) {
      setTimeout(() => {
        setOrders(orders.filter(o => o.id !== orderId));
        setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
        }
        setDeletingOrderIds([]);
        showToast('Order deleted successfully');
      }, 500);
    } else {
      showToast('Failed to delete order', 'error');
      setDeletingOrderIds([]);
    }
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrderIds.length === 0) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedOrderIds.length} selected order(s)?`);
    if (!confirmDelete) return;

    setDeletingOrderIds(selectedOrderIds);

    const { error } = await supabase
      .from('orders')
      .delete()
      .in('id', selectedOrderIds);

    if (!error) {
      setTimeout(() => {
        setOrders(orders.filter(o => !selectedOrderIds.includes(o.id)));
        if (selectedOrder && selectedOrderIds.includes(selectedOrder.id)) {
          setSelectedOrder(null);
        }
        setSelectedOrderIds([]);
        setDeletingOrderIds([]);
        showToast('Selected orders deleted successfully');
      }, 600);
    } else {
      showToast('Failed to delete selected orders', 'error');
      setDeletingOrderIds([]);
    }
  };

  const handleAddProduct = async (e: any, locked: boolean = false) => {
    e.preventDefault();
    if (!pName || !pPrice) return;

    setIsLoading(true);

    const finalImage = imagePreview || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&q=80';
    
    const sizesList = Object.keys(pSizesStock);
    const totalStockQty = Object.values(pSizesStock).reduce((a, b) => a + b, 0);

    const newP: any = {
      name: pName,
      price: parseFloat(pPrice),
      stock: totalStockQty,
      category: pCategory,
      image_url: finalImage,
      sizes: sizesList.length > 0 ? sizesList : getAvailableSizes(pCategory).slice(0, 4),
      sizes_stock: pSizesStock
    };

    if (pCostPrice !== '') {
      newP.cost_price = parseFloat(pCostPrice) || 0;
    }

    if (locked) {
      newP.is_locked = true;
    }

    let { data, error } = await supabase.from('products').insert([newP]).select();

    if (error && error.message && error.message.includes('cost_price')) {
      delete newP.cost_price;
      const retryResult = await supabase.from('products').insert([newP]).select();
      data = retryResult.data;
      error = retryResult.error;
    }

    setIsLoading(false);

    if (!error && data) {
      setProducts([...products, data[0]]);
      setPName('');
      setPCostPrice('');
      setPPrice('');
      setPSizesStock({});
      setImageFile(null);
      setImagePreview('');
      
      showToast('✨ Product added successfully!');
    } else if (locked && error && error.message && error.message.includes('is_locked')) {
      showToast('Run the Supabase SQL setup first (is_locked column is missing)', 'error');
    } else {
      showToast('Error saving product', 'error');
    }
  };

  const handleToggleProductLock = async (product: any) => {
    const makeLocked = !product.is_locked;
    const { error } = await supabase
      .from('products')
      .update({ is_locked: makeLocked })
      .eq('id', product.id);

    if (!error) {
      setProducts(products.map(p => p.id === product.id ? { ...p, is_locked: makeLocked } : p));
      showToast(makeLocked ? '🔒 Moved to the private section' : '🔓 Moved to the public store');
    } else {
      showToast('Failed to update product (did you run the SQL setup?)', 'error');
    }
  };

  const handleChangePrivatePassword = async (e: any) => {
    e.preventDefault();

    if (pwNew.length < 4) {
      showToast('New password must be at least 4 characters', 'error');
      return;
    }
    if (pwNew !== pwConfirm) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }

    setIsChangingPw(true);
    const { data, error } = await supabase.rpc('change_private_password', { old_pw: pwOld, new_pw: pwNew });
    setIsChangingPw(false);

    if (!error && data === true) {
      setPwOld('');
      setPwNew('');
      setPwConfirm('');
      showToast('🔑 Password changed successfully');
    } else if (!error) {
      showToast('Current password is incorrect', 'error');
    } else {
      showToast('Could not change password (did you run the SQL setup?)', 'error');
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setEditName(product.name || '');
    setEditCostPrice(product.cost_price ? String(product.cost_price) : '0');
    setEditPrice(String(product.price || 0));
    setEditCategory(product.category || 'hoodies');
    setEditSizesStock(product.sizes_stock && typeof product.sizes_stock === 'object' ? product.sizes_stock : {});
    setEditImagePreview(product.image_url || '');
  };

  const handleSaveProductEdit = async (e: any) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingEdit(true);

    const sizesList = Object.keys(editSizesStock);
    const totalStockQty = Object.values(editSizesStock).reduce((a, b) => a + b, 0);

    const updatedData: any = {
      name: editName,
      price: parseFloat(editPrice) || 0,
      stock: totalStockQty,
      category: editCategory,
      sizes: sizesList.length > 0 ? sizesList : getAvailableSizes(editCategory),
      sizes_stock: editSizesStock,
      image_url: editImagePreview || editingProduct.image_url,
    };

    if (editCostPrice !== '') {
      updatedData.cost_price = parseFloat(editCostPrice) || 0;
    }

    let { error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', editingProduct.id);

    if (error && error.message && error.message.includes('cost_price')) {
      delete updatedData.cost_price;
      const retryResult = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', editingProduct.id);
      error = retryResult.error;
    }

    setIsSavingEdit(false);

    if (!error) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...updatedData } : p));
      setEditingProduct(null);
      showToast('✨ Product updated successfully!');
    } else {
      showToast('Error updating product', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
      showToast('Product deleted successfully');
    } else {
      showToast('Failed to delete product', 'error');
    }
  };

  const handlePosSizeSelect = (productId: any, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const addToCart = async (prod: any) => {
    const sizeToUse = selectedSizes[prod.id] || (Array.isArray(prod.sizes) && prod.sizes[0]) || 'M';
    
    const sizesStockMap = prod.sizes_stock || {};
    const currentSizeStock = sizesStockMap[sizeToUse] !== undefined ? Number(sizesStockMap[sizeToUse]) : Number(prod.stock) || 0;

    if (currentSizeStock <= 0) {
      showToast(`Size "${sizeToUse}" is Out of Stock!`, 'error');
      return;
    }

    const cartItemId = `${prod.id}-${sizeToUse}`;
    
    const updatedSizesStock = { ...sizesStockMap, [sizeToUse]: currentSizeStock - 1 };
    const newTotalStock = Object.values(updatedSizesStock).reduce((a: any, b: any) => a + Number(b), 0);

    const { error } = await supabase
      .from('products')
      .update({ stock: newTotalStock, sizes_stock: updatedSizesStock })
      .eq('id', prod.id);

    if (!error) {
      setProducts(products.map(p => p.id === prod.id ? { ...p, stock: newTotalStock, sizes_stock: updatedSizesStock } : p));
      
      const exist = cart.find((item) => item.cartItemId === cartItemId);
      const productCost = Number(prod.cost_price) || 0;
      if (exist) {
        setCart(cart.map((item) => item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item));
      } else {
        setCart([...cart, { ...prod, cartItemId, selectedSize: sizeToUse, qty: 1, cost_price: productCost }]);
      }
      showToast(`Added "${prod.name}" (${sizeToUse}) to cart`);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const itemToRemove = cart.find(i => i.cartItemId === cartItemId);
    if (itemToRemove) {
      const prodId = itemToRemove.id;
      const returnedQty = itemToRemove.qty;
      const returnedSize = itemToRemove.selectedSize || 'M';
      const targetProd = products.find(p => p.id === prodId);

      if (targetProd) {
        const sizesStockMap = targetProd.sizes_stock || {};
        const currentSizeStock = Number(sizesStockMap[returnedSize]) || 0;
        const updatedSizesStock = { ...sizesStockMap, [returnedSize]: currentSizeStock + returnedQty };
        const restoredTotalStock = Object.values(updatedSizesStock).reduce((a: any, b: any) => a + Number(b), 0);

        await supabase.from('products').update({ stock: restoredTotalStock, sizes_stock: updatedSizesStock }).eq('id', prodId);
        setProducts(products.map(p => p.id === prodId ? { ...p, stock: restoredTotalStock, sizes_stock: updatedSizesStock } : p));
      }
    }
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
    showToast('Removed item from cart', 'info');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);

  const handlePOSCheckout = async (e: any) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerInfo.name.trim() || !customerInfo.phone.trim()) {
      alert('Please fill in Customer Name and Phone Number');
      return;
    }

    if ((customerInfo.paymentMethod === 'Syriatel Cash' || customerInfo.paymentMethod === 'Sham Cash') && !customerInfo.txCode.trim()) {
      alert('Please enter Transaction Code / Account No.');
      return;
    }

    setIsSubmittingOrder(true);

    const paymentText = customerInfo.paymentMethod === 'Cash' 
      ? 'Cash' 
      : `${customerInfo.paymentMethod} (${customerInfo.txCode})`;

    const newOrder = {
      totals: cartTotal,
      customer_name: customerInfo.name.trim(),
      phone: customerInfo.phone.trim(),
      address: customerInfo.address || 'In-Store',
      payment_method: paymentText,
      order_type: 'POS',
      status: 'completed',
      items: cart,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('orders').insert([newOrder]).select();
    
    setIsSubmittingOrder(false);

    if (!error) {
      if (data) {
        setOrders([data[0], ...orders]);
      }
      setIsCheckoutOpen(false);
      setShowPrintPrompt(true);
      showToast('🎉 Sale completed successfully!');
    } else {
      showToast('Error saving POS order', 'error');
    }
  };

  const handleConfirmPrint = () => {
    setShowPrintPrompt(false);
    window.print();
    setCart([]);
    setCustomerInfo({ name: '', phone: '', address: 'In-Store', paymentMethod: 'Cash', txCode: '' });
  };

  const handleSkipPrint = () => {
    setShowPrintPrompt(false);
    setCart([]);
    setCustomerInfo({ name: '', phone: '', address: 'In-Store', paymentMethod: 'Cash', txCode: '' });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedPosCategory === 'all' || p.category === selectedPosCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredInventoryProducts = products.filter(p => 
    p.name.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const status = (o.status || 'pending').toLowerCase();
    if (orderSubTab === 'completed') {
      return status === 'completed';
    } else {
      return status !== 'completed';
    }
  });

  const isAllFilteredSelected = filteredOrders.length > 0 && filteredOrders.every(o => selectedOrderIds.includes(o.id));

  const toggleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIds = filteredOrders.map(o => o.id);
      setSelectedOrderIds(selectedOrderIds.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredOrders.map(o => o.id);
      const combined = Array.from(new Set([...selectedOrderIds, ...filteredIds]));
      setSelectedOrderIds(combined);
    }
  };

  const toggleSelectOrder = (id: number) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter(i => i !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const getStatusColorClass = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'text-emerald-400 font-bold';
    if (s === 'pending') return 'text-amber-500 font-bold';
    return 'text-zinc-300 font-bold';
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (authState !== 'in') {
    return (
      <div dir="ltr" className="dark">
        <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-zinc-950 text-zinc-100">
          {authState === 'checking' ? (
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          ) : (
            <form
              onSubmit={handleAdminLogin}
              className="w-full max-w-sm p-6 rounded-3xl border shadow-xl space-y-5 bg-zinc-900 border-zinc-800"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-100 text-zinc-900">
                  <Lock className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-black tracking-wider">J-STORE</h1>
                <p className="text-xs font-semibold text-zinc-400">Admin Login</p>
              </div>

              <input
                type="password"
                autoFocus
                required
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(null); }}
                placeholder="Password"
                className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
              />

              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep me signed in on this device
              </label>

              {loginError && <p className="text-xs font-bold text-red-400">{loginError}</p>}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Sign In</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="dark">
      <div className="min-h-screen transition-colors duration-200 font-sans bg-zinc-950 text-zinc-100">
        
        <style jsx global>{`
          .print-only {
            display: none !important;
          }
          .print-only-inline {
            display: none !important;
          }
          @keyframes pulse-bg {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .animate-skeleton {
            animation: pulse-bg 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #09090b;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: #27272a;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #3f3f46;
          }

          @media print {
            header, nav, main, .no-print, .print-hidden-checkbox, .print-hidden-actions, .screen-only-select {
              display: none !important;
            }

            #printable-invoice {
              display: block !important;
              width: 100% !important;
              margin: 0 auto !important;
              padding: 20px !important;
              background-color: #ffffff !important;
              color: #000000 !important;
            }

            html, body {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
          }
        `}</style>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-all duration-300">
            <div className={`px-5 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-950 border-red-500/50 text-red-200' :
              toast.type === 'info' ? 'bg-blue-950 border-blue-500/50 text-blue-200' :
              'bg-emerald-950 border-emerald-500/50 text-emerald-200'
            }`}>
              <Check className="w-4 h-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <header className="border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center transition-colors shadow-sm no-print border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shadow-sm bg-zinc-100 text-zinc-900">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider">J-STORE</h1>
              <p className="text-xs font-semibold text-zinc-400">
                Admin & POS Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleAdminLogout}
            className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex justify-between items-center border-b pb-2 mb-8 gap-4 overflow-x-auto border-zinc-800 no-print">
            <nav className="flex gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
                { id: 'orders', label: 'Orders & Sales', icon: ClipboardList },
                { id: 'private', label: 'Private & Security', icon: Lock },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                      active 
                        ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {activeTab === 'orders' && (
                <button
                  onClick={exportToExcelCSV}
                  className="p-2.5 rounded-xl border transition flex items-center gap-2 text-xs font-bold bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600 hover:text-white"
                  title="Export Sales to Excel (CSV)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline">Export Excel</span>
                </button>
              )}

              <button
                onClick={fetchOrders}
                disabled={isRefreshingOrders}
                className="p-2.5 rounded-xl border transition flex items-center gap-2 text-xs font-bold bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshingOrders ? 'animate-spin text-emerald-400' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">

              {analytics.lowStockProducts.length > 0 && (
                <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-amber-400 uppercase">Low Stock Warning</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {analytics.lowStockProducts.map(p => `${p.name}`).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                
                <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-zinc-400">Total Revenue</span>
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black">${analytics.totalSalesSum}</p>
                  <span className="text-[10px] text-zinc-500 font-semibold mt-2 block">All-time Sales</span>
                </div>

                <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-emerald-500/30 bg-gradient-to-br from-zinc-900 to-emerald-950/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-emerald-400">Estimated Net Profit</span>
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-emerald-400">${analytics.totalEstimatedProfit}</p>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-2 block">(Selling Price - Cost) × Qty</span>
                </div>

                <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-zinc-400">Today vs Yesterday</span>
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black">${analytics.todaySales}</p>
                    <span className="text-xs text-zinc-400">/ ${analytics.yesterdaySales}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold mt-2">
                    {analytics.todaySales >= analytics.yesterdaySales ? (
                      <span className="text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> Higher than yesterday</span>
                    ) : (
                      <span className="text-amber-500 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5" /> Lower than yesterday</span>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-zinc-400">This Month vs Last Month</span>
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black">${analytics.currentMonthSales}</p>
                    <span className="text-xs text-zinc-400">/ ${analytics.previousMonthSales}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-semibold mt-2 block">Monthly Comparative Analysis</span>
                </div>

                <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-zinc-400">Top Sales Day This Month</span>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-amber-400">Day {analytics.maxDay}</p>
                  <span className="text-[10px] text-zinc-400 font-bold mt-2 block">${analytics.maxDaySales} recorded sales</span>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" /> Top Customers
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400">Most Valuable Buyers</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center">
                      <thead className="border-b font-bold bg-zinc-800/60 text-zinc-300">
                        <tr>
                          <th className="p-3 text-left">Customer Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Orders</th>
                          <th className="p-3">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {analytics.topCustomersList.length === 0 ? (
                          <tr><td colSpan={4} className="py-6 text-zinc-500 text-center">No customer data yet.</td></tr>
                        ) : (
                          analytics.topCustomersList.map((c, i) => (
                            <tr key={i}>
                              <td className="p-3 font-bold text-left text-white">{c.name}</td>
                              <td className="p-3 font-mono text-zinc-400">{c.phone}</td>
                              <td className="p-3 font-bold text-zinc-300">{c.ordersCount}</td>
                              <td className="p-3 font-mono font-black text-emerald-400">${c.totalSpent}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Payment Methods Breakdown
                  </h3>
                  <div className="space-y-3 pt-2">
                    {Object.entries(analytics.paymentMethodsMap).map(([method, count]) => {
                      const totalOrdersCount = orders.length || 1;
                      const percentage = ((count / totalOrdersCount) * 100).toFixed(0);

                      return (
                        <div key={method} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-zinc-300">{method}</span>
                            <span className="font-mono text-emerald-400">{count} orders ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-3xl border flex items-center justify-between shadow-sm bg-zinc-900 border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award className="w-4 h-4" /> Top Selling Product
                    </span>
                    <h3 className="text-lg font-black">{analytics.topProduct ? analytics.topProduct.name : 'N/A'}</h3>
                    <p className="text-xs text-zinc-400 font-semibold">
                      {analytics.topProduct ? `${analytics.topProduct.qty} Units Sold · Total Revenue: $${analytics.topProduct.revenue}` : 'No sales data yet'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>

                <div className="p-6 rounded-3xl border flex items-center justify-between shadow-sm bg-zinc-900 border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> Least Selling Product
                    </span>
                    <h3 className="text-lg font-black">{analytics.leastProduct ? analytics.leastProduct.name : 'N/A'}</h3>
                    <p className="text-xs text-zinc-400 font-semibold">
                      {analytics.leastProduct ? `${analytics.leastProduct.qty} Units Sold · Total Revenue: $${analytics.leastProduct.revenue}` : 'No sales data yet'}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <TrendingDown className="w-8 h-8" />
                  </div>
                </div>

              </div>

              <div className="p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-white">Daily Sales Breakdown (Current Month)</h3>
                    <p className="text-xs text-zinc-400">Day by day comparison of total sales in USD ($)</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                    {monthNames[currentMonthInfo.month]} {currentMonthInfo.year}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-72 pr-1">
                  <table className="w-full text-xs text-center">
                    <thead className="border-b font-bold sticky top-0 bg-zinc-900 text-zinc-300">
                      <tr>
                        <th className="p-3">Day</th>
                        <th className="p-3">Sales Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {Object.entries(analytics.daysInMonthMap).map(([day, val]) => (
                        <tr key={day} className={Number(val) > 0 ? 'bg-emerald-950/30' : ''}>
                          <td className="p-3 font-bold font-mono">Day {day}</td>
                          <td className={`p-3 font-mono font-bold ${Number(val) > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            ${val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-white">Annual Monthly Performance Comparison</h3>
                    <p className="text-xs text-zinc-400">Overview of total sales per month across the current year</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">Year {currentMonthInfo.year}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center">
                    <thead className="border-b font-bold bg-zinc-800 text-zinc-300">
                      <tr>
                        <th className="p-3">Month</th>
                        <th className="p-3">Sales Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {monthNames.map((mName, mIdx) => {
                        const val = analytics.monthsInYearMap[mIdx] || 0;
                        return (
                          <tr key={mName} className={val > 0 ? 'bg-emerald-950/30' : ''}>
                            <td className="p-3 font-bold">{mName}</td>
                            <td className={`p-3 font-mono font-bold ${val > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                              ${val}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                <h2 className="text-sm font-black flex items-center gap-2 mb-6 text-white">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Add New Product & Size Quantities
                </h2>

                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Product Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nike Air Force"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Cost Price ($) (Optional)</label>
                      <input
                        type="number"
                        placeholder="25"
                        value={pCostPrice}
                        onChange={(e) => setPCostPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Selling Price ($)</label>
                      <input
                        type="number"
                        required
                        placeholder="45"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Category</label>
                      <select
                        value={pCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none cursor-pointer bg-zinc-950 border-zinc-800 text-white"
                      >
                        <option value="hoodies">🧥 Hoodies</option>
                        <option value="jackets">🧥 Jackets</option>
                        <option value="tshirts">👕 T-Shirts</option>
                        <option value="shoes">👟 Shoes</option>
                        <option value="pants">👖 Pants & Shorts</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Product Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="product-image-upload"
                        />
                        <label
                          htmlFor="product-image-upload"
                          className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                        >
                          <Upload className="w-4 h-4 text-emerald-400" />
                          <span>{imageFile ? imageFile.name : 'Choose Image...'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border bg-zinc-950 border-zinc-800 space-y-3">
                    <label className="text-xs font-black block text-emerald-400">
                      Set Quantity per Size:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {getAvailableSizes(pCategory).map((size) => (
                        <div key={size} className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 block">Size {size}</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={pSizesStock[size] || ''}
                            onChange={(e) => handleSizeStockChange(size, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-zinc-900 border-zinc-700 text-white text-center font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Save Product</span>
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="text-sm font-extrabold text-white">Inventory List</h3>
                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute top-3 left-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full text-xs py-2 rounded-full border outline-none pl-10 pr-4 bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center">
                    <thead className="border-b font-bold bg-zinc-800/60 text-zinc-300">
                      <tr>
                        <th className="p-3">Image</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Cost Price</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Stock by Size</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {filteredInventoryProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-zinc-500">
                            No products found.
                          </td>
                        </tr>
                      ) : (
                        filteredInventoryProducts.map((p) => {
                          const sizesStock = p.sizes_stock || {};
                          return (
                            <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                              <td className="p-3">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-800">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-5 h-5 text-zinc-600" />
                                  )}
                                </div>
                              </td>
                              <td className="p-3 font-bold text-white">{p.is_locked ? '🔒 ' : ''}{p.name}</td>
                              <td className="p-3 font-mono text-zinc-400">${p.cost_price || 0}</td>
                              <td className="p-3 font-mono font-bold text-emerald-400">${p.price}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {Object.keys(sizesStock).length === 0 ? (
                                    <span className="text-zinc-500">Stock: {p.stock}</span>
                                  ) : (
                                    Object.entries(sizesStock).map(([sz, qty]) => (
                                      <span key={sz} className="px-2 py-0.5 bg-zinc-800 rounded font-mono text-[10px]">
                                        {sz}: <strong className={Number(qty) <= 0 ? 'text-red-400' : 'text-emerald-400'}>{String(qty)}</strong>
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold hover:bg-amber-500 hover:text-black transition flex items-center gap-1.5"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'private' && (
            <div className="space-y-8">
              <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                <h2 className="text-sm font-black flex items-center gap-2 mb-2 text-white">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Change Admin Login Password
                </h2>
                <p className="text-xs text-zinc-400 mb-6">
                  This is the password you use to sign in to this dashboard.
                </p>

                <form onSubmit={handleChangeAdminPassword} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Current Password</label>
                    <input
                      type="password"
                      required
                      value={admOld}
                      onChange={(e) => setAdmOld(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">New Password</label>
                    <input
                      type="password"
                      required
                      value={admNew}
                      onChange={(e) => setAdmNew(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={admConfirm}
                      onChange={(e) => setAdmConfirm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingAdm}
                    className="py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isChangingAdm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Change Password</span>
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                <h2 className="text-sm font-black flex items-center gap-2 mb-2 text-white">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Change Private Section Password
                </h2>
                <p className="text-xs text-zinc-400 mb-6">
                  Customers use this password (the lock icon in the store header) to see the private products.
                </p>

                <form onSubmit={handleChangePrivatePassword} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Current Password</label>
                    <input
                      type="password"
                      required
                      value={pwOld}
                      onChange={(e) => setPwOld(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">New Password</label>
                    <input
                      type="password"
                      required
                      value={pwNew}
                      onChange={(e) => setPwNew(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingPw}
                    className="py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isChangingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Change Password</span>
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-3xl border shadow-sm bg-zinc-900 border-zinc-800">
                <h2 className="text-sm font-black flex items-center gap-2 mb-6 text-white">
                  <Plus className="w-4 h-4 text-amber-400" />
                  Add Private Product (hidden behind the password)
                </h2>

                <form onSubmit={(e) => handleAddProduct(e, true)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Product Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Limited Edition Hoodie"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Cost Price ($) (Optional)</label>
                      <input
                        type="number"
                        placeholder="25"
                        value={pCostPrice}
                        onChange={(e) => setPCostPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Selling Price ($)</label>
                      <input
                        type="number"
                        required
                        placeholder="45"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Category</label>
                      <select
                        value={pCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none cursor-pointer bg-zinc-950 border-zinc-800 text-white"
                      >
                        <option value="hoodies">🧥 Hoodies</option>
                        <option value="jackets">🧥 Jackets</option>
                        <option value="tshirts">👕 T-Shirts</option>
                        <option value="shoes">👟 Shoes</option>
                        <option value="pants">👖 Pants & Shorts</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-zinc-400">Product Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="private-product-image-upload"
                        />
                        <label
                          htmlFor="private-product-image-upload"
                          className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                        >
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span>{imageFile ? imageFile.name : 'Choose Image...'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border bg-zinc-950 border-zinc-800 space-y-3">
                    <label className="text-xs font-black block text-amber-400">
                      Set Quantity per Size:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {getAvailableSizes(pCategory).map((size) => (
                        <div key={size} className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 block">Size {size}</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={pSizesStock[size] || ''}
                            onChange={(e) => handleSizeStockChange(size, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-zinc-900 border-zinc-700 text-white text-center font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    <span>Save Private Product</span>
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                <h3 className="text-sm font-extrabold text-white">Private Products ({products.filter(p => p.is_locked).length})</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center">
                    <thead className="border-b font-bold bg-zinc-800/60 text-zinc-300">
                      <tr>
                        <th className="p-3">Image</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Stock by Size</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {products.filter(p => p.is_locked).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-zinc-500">
                            No private products yet.
                          </td>
                        </tr>
                      ) : (
                        products.filter(p => p.is_locked).map((p) => {
                          const sizesStock = p.sizes_stock || {};
                          return (
                            <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                              <td className="p-3">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-800">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-5 h-5 text-zinc-600" />
                                  )}
                                </div>
                              </td>
                              <td className="p-3 font-bold text-white">{p.name}</td>
                              <td className="p-3 font-mono font-bold text-emerald-400">${p.price}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {Object.keys(sizesStock).length === 0 ? (
                                    <span className="text-zinc-500">Stock: {p.stock}</span>
                                  ) : (
                                    Object.entries(sizesStock).map(([sz, qty]) => (
                                      <span key={sz} className="px-2 py-0.5 bg-zinc-800 rounded font-mono text-[10px]">
                                        {sz}: <strong className={Number(qty) <= 0 ? 'text-red-400' : 'text-emerald-400'}>{String(qty)}</strong>
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold hover:bg-amber-500 hover:text-black transition flex items-center gap-1.5"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleToggleProductLock(p)}
                                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold hover:bg-zinc-700 transition"
                                    title="Move to the public store"
                                  >
                                    Make Public
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-zinc-500">
                  Tip: you can also hide an existing public product with the "Move an Existing Product to Private" box below.
                </p>
              </div>

              <div className="p-6 rounded-3xl border shadow-sm space-y-4 bg-zinc-900 border-zinc-800">
                <h3 className="text-sm font-extrabold text-white">Move an Existing Product to Private</h3>
                <div className="flex flex-wrap gap-2">
                  {products.filter(p => !p.is_locked).length === 0 ? (
                    <span className="text-xs text-zinc-500">No public products.</span>
                  ) : (
                    products.filter(p => !p.is_locked).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleToggleProductLock(p)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition flex items-center gap-1.5"
                      >
                        <Lock className="w-3 h-3" />
                        {p.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="space-y-6">
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'all', label: 'All Products' },
                  { id: 'hoodies', label: 'Hoodies' },
                  { id: 'jackets', label: 'Jackets' },
                  { id: 'tshirts', label: 'T-Shirts' },
                  { id: 'shoes', label: 'Footwear' },
                  { id: 'pants', label: 'Pants & Shorts' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedPosCategory(tab.id)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      selectedPosCategory === tab.id
                        ? 'bg-white text-black'
                        : 'bg-neutral-900 text-gray-300 border border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => {
                    const sizesStockMap = product.sizes_stock || {};
                    const availableSizes = Object.keys(sizesStockMap).length > 0 
                      ? Object.keys(sizesStockMap) 
                      : (Array.isArray(product.sizes) ? product.sizes : ['XS', 'S', 'M', 'L']);
                      
                    const currentSelectedSize = selectedSizes[product.id] || availableSizes[0];
                    
                    const currentSizeStock = sizesStockMap[currentSelectedSize] !== undefined ? Number(sizesStockMap[currentSelectedSize]) : Number(product.stock) || 0;
                    const isSizeOutOfStock = currentSizeStock <= 0;

                    const totalStock = Object.values(sizesStockMap).length > 0 
                      ? Object.values(sizesStockMap).reduce((a: any, b: any) => a + Number(b), 0)
                      : Number(product.stock) || 0;

                    const isProductFullyOut = totalStock <= 0;

                    return (
                      <div key={product.id} className="rounded-2xl border overflow-hidden flex flex-col justify-between hover:shadow-2xl transition duration-300 bg-neutral-900 border-neutral-800">
                        <div className="relative aspect-square p-4 flex items-center justify-center cursor-pointer bg-black">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform hover:scale-110 z-20">
                            <Heart className="w-4 h-4 text-white/80" />
                          </button>
                        </div>

                        <div className="p-4 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">J-STORE</span>
                              
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isSizeOutOfStock ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {isSizeOutOfStock ? `Size ${currentSelectedSize} Out of Stock` : `Stock: ${totalStock}`}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold mb-2">{product.name}</h3>
                            
                            <div className="mb-4">
                              <span className="text-[10px] text-gray-400 block mb-1">Select Size:</span>
                              <div className="flex flex-wrap gap-1">
                                {availableSizes.map((size: string) => {
                                  const szQty = sizesStockMap[size] !== undefined ? Number(sizesStockMap[size]) : 1;
                                  const isSzOut = szQty <= 0;

                                  return (
                                    <button
                                      key={size}
                                      onClick={() => {
                                        if (!isSzOut) {
                                          handlePosSizeSelect(product.id, size);
                                        }
                                      }}
                                      disabled={isSzOut}
                                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                                        currentSelectedSize === size
                                          ? 'bg-white text-black border-white font-bold'
                                          : 'bg-neutral-800 text-gray-300 border-transparent hover:bg-neutral-700'
                                      } ${isSzOut ? 'opacity-30 line-through cursor-not-allowed bg-neutral-900 text-neutral-600' : ''}`}
                                    >
                                      {size}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-lg font-black mb-3">${product.price}</div>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={isSizeOutOfStock || isProductFullyOut}
                              className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                                (isSizeOutOfStock || isProductFullyOut)
                                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border-neutral-700' 
                                  : 'bg-white hover:bg-gray-200 text-black border-black'
                              }`}
                            >
                              {isSizeOutOfStock ? 'Size Out of Stock' : 'Add to Cart +'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-[580px] sticky top-24 bg-neutral-900 border-neutral-800">
                  <div>
                    <h2 className="font-extrabold text-sm mb-4">POS Cart</h2>
                    <div className="space-y-3 overflow-y-auto max-h-[360px]">
                      {cart.length === 0 ? (
                        <p className="text-xs text-center py-20 text-gray-500">Cart is empty</p>
                      ) : (
                        cart.map((item) => (
                          <div key={item.cartItemId} className="flex justify-between items-center text-xs border-b pb-2.5 border-neutral-800">
                            <div>
                              <p className="font-bold">{item.name}</p>
                              <p className="text-[10px] text-gray-400">${item.price} × {item.qty} (Size: {item.selectedSize})</p>
                            </div>
                            <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500 font-bold">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-800 space-y-3">
                    <div className="flex justify-between font-black text-base">
                      <span>Total:</span>
                      <span className="text-emerald-400">${cartTotal}</span>
                    </div>
                    <button 
                      onClick={() => setIsCheckoutOpen(true)}
                      disabled={cart.length === 0}
                      className="w-full py-3 text-xs font-bold rounded-xl bg-white text-black disabled:opacity-50 cursor-pointer hover:bg-gray-200 transition"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOrderSubTab('pending');
                      setSelectedOrderIds([]);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      orderSubTab === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Pending Orders
                  </button>
                  <button
                    onClick={() => {
                      setOrderSubTab('completed');
                      setSelectedOrderIds([]);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      orderSubTab === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Completed Orders
                  </button>
                </div>

                {selectedOrderIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedOrders}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected ({selectedOrderIds.length})</span>
                  </button>
                )}
              </div>

              <div className="rounded-2xl border overflow-hidden shadow-sm bg-zinc-900 border-zinc-800">
                <table className="w-full text-xs text-center">
                  <thead className="border-b font-bold bg-zinc-800/60 text-zinc-300">
                    <tr>
                      <th className="p-4 w-10 print-hidden-checkbox">
                        <input
                          type="checkbox"
                          checked={isAllFilteredSelected}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                        />
                      </th>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Change Status</th>
                      <th className="p-4 print-hidden-actions">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {isRefreshingOrders ? (
                      [1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="animate-skeleton">
                          <td className="p-4 print-hidden-checkbox"><div className="h-4 bg-zinc-800 rounded w-4 mx-auto"></div></td>
                          <td className="p-4"><div className="h-4 bg-zinc-800 rounded-lg w-12 mx-auto"></div></td>
                          <td className="p-4"><div className="h-4 bg-zinc-800 rounded-lg w-16 mx-auto"></div></td>
                          <td className="p-4"><div className="h-4 bg-zinc-800 rounded-lg w-28 mx-auto"></div></td>
                          <td className="p-4"><div className="h-4 bg-zinc-800 rounded-lg w-24 mx-auto"></div></td>
                          <td className="p-4"><div className="h-4 bg-zinc-800 rounded-lg w-20 mx-auto"></div></td>
                          <td className="p-4"><div className="h-4 bg-zinc-800 rounded-lg w-12 mx-auto"></div></td>
                          <td className="p-4"><div className="h-7 bg-zinc-800 rounded-lg w-24 mx-auto"></div></td>
                          <td className="p-4 print-hidden-actions"><div className="h-7 bg-zinc-800 rounded-lg w-16 mx-auto"></div></td>
                        </tr>
                      ))
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-gray-400">No orders found.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const isDeletingThis = deletingOrderIds.includes(o.id);
                        if (isDeletingThis) return null;

                        const isSelected = selectedOrderIds.includes(o.id);

                        return (
                          <tr key={o.id} className={isSelected ? 'bg-zinc-800/40' : ''}>
                            <td className="p-4 w-10 print-hidden-checkbox">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOrder(o.id)}
                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                              />
                            </td>
                            <td className="p-4 font-mono font-bold">#{o.id}</td>
                            <td className="p-4 font-bold">{o.order_type || 'Online'}</td>
                            <td className="p-4 font-bold">{o.customer_name || 'General'}</td>
                            <td className="p-4 font-mono">{o.phone || '-'}</td>
                            <td className="p-4">{o.payment_method || 'Cash'}</td>
                            <td className="p-4 font-bold">${o.totals ?? o.total}</td>
                            
                            <td className="p-4">
                              <div className="screen-only-select">
                                <select
                                  value={o.status || 'pending'}
                                  disabled={updatingOrderId === o.id}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={`px-3 py-1.5 rounded-lg font-extrabold text-xs bg-zinc-950 border border-zinc-800 cursor-pointer outline-none focus:border-zinc-500 ${getStatusColorClass(o.status)}`}
                                >
                                  <option value="pending" className="text-amber-500 font-bold bg-zinc-900">Pending</option>
                                  <option value="completed" className="text-emerald-400 font-bold bg-zinc-900">Completed</option>
                                </select>
                              </div>
                            </td>

                            <td className="p-4 print-hidden-actions">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => setSelectedOrder(o)} className="px-3 py-1.5 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition">View</button>
                                <button onClick={() => handleDeleteOrder(o.id)} title="Delete Order" className="p-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition"><X className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>

        {/* 🖨️ قسم الفاتورة المخصصة للطباعة حصراً */}
        <div id="printable-invoice" className="print-only">
          <div className="text-center pb-3 border-b border-black mb-4 space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-wider text-black">J-STORE</h1>
            <p className="text-xs text-black font-semibold">POS Direct Sale Invoice</p>
            <p className="text-[10px] text-black font-mono">{currentDateTime}</p>
          </div>

          <div className="space-y-4 text-xs text-black font-bold">
            <div className="p-3 border border-black rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold block text-black">Customer Name:</span>
                <span className="text-sm font-black text-black">{selectedOrder ? selectedOrder.customer_name : (customerInfo.name || 'Direct Sale')}</span>
              </div>
              <div className="text-right">
                <span className="font-bold block text-black">Phone:</span>
                <span className="text-sm font-mono font-bold text-black">{selectedOrder ? selectedOrder.phone : (customerInfo.phone || '-')}</span>
              </div>
            </div>

            <div className="p-3 border border-black rounded-xl space-y-2">
              <div className="font-bold text-black border-b border-black pb-2 grid grid-cols-4 text-left">
                <span>Item</span>
                <span className="text-center">Size</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Price</span>
              </div>
              <div className="space-y-2 pt-1">
                {selectedOrder && Array.isArray(selectedOrder.items) ? (
                  selectedOrder.items.map((item: any, idx: number) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.qty) || 1;
                    return (
                      <div key={idx} className="grid grid-cols-4 items-center text-left text-black">
                        <span className="font-black text-xs text-black">{item.name}</span>
                        <span className="text-center font-normal">{item.selectedSize || item.size || 'N/A'}</span>
                        <span className="text-center font-normal">{qty}</span>
                        <span className="text-right font-mono font-black">${price * qty}</span>
                      </div>
                    );
                  })
                ) : (
                  cart.map((item, idx) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.qty) || 1;
                    return (
                      <div key={idx} className="grid grid-cols-4 items-center text-left text-black">
                        <span className="font-black text-xs text-black">{item.name}</span>
                        <span className="text-center font-normal">{item.selectedSize || 'M'}</span>
                        <span className="text-center font-normal">{qty}</span>
                        <span className="text-right font-mono font-black">${price * qty}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-3 border-2 border-black rounded-xl flex justify-between items-center font-black text-sm text-black">
              <span>Total Amount:</span>
              <span className="text-base text-black">${selectedOrder ? (selectedOrder.totals ?? selectedOrder.total) : cartTotal}</span>
            </div>

            <div className="text-center pt-8 mt-6 border-t border-black">
              <p className="font-bold text-xs text-black">Thank you for shopping with J-STORE!</p>
            </div>
          </div>
        </div>

        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
            <div className="w-full max-w-2xl rounded-3xl p-6 shadow-2xl border space-y-5 my-8 bg-zinc-900 border-zinc-800 text-white relative">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-lg text-white">Edit Product & Size Stock</h3>
                </div>
                <button onClick={() => setEditingProduct(null)} className="p-1.5 rounded-full hover:bg-zinc-800 font-bold"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveProductEdit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Product Name</label>
                    <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Category</label>
                    <select value={editCategory} onChange={(e) => handleEditCategoryChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none cursor-pointer bg-zinc-950 border-zinc-800 text-white">
                      <option value="hoodies">🧥 Hoodies</option>
                      <option value="jackets">🧥 Jackets</option>
                      <option value="tshirts">👕 T-Shirts</option>
                      <option value="shoes">👟 Shoes</option>
                      <option value="pants">👖 Pants & Shorts</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Cost Price ($)</label>
                    <input type="number" value={editCostPrice} onChange={(e) => setEditCostPrice(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-zinc-400">Selling Price ($)</label>
                    <input type="number" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs outline-none bg-zinc-950 border-zinc-800 text-white focus:border-zinc-600" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border bg-zinc-950 border-zinc-800 space-y-3">
                  <label className="text-xs font-black block text-amber-400">Update Quantity per Size:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {getAvailableSizes(editCategory).map((size) => (
                      <div key={size} className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 block">Size {size}</span>
                        <input type="number" min="0" placeholder="Qty" value={editSizesStock[size] ?? ''} onChange={(e) => handleEditSizeStockChange(size, e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-zinc-900 border-zinc-700 text-white text-center font-mono" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-zinc-800">
                  <button type="button" onClick={() => setEditingProduct(null)} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition">Cancel</button>
                  <button type="submit" disabled={isSavingEdit} className="w-1/2 py-3 rounded-xl font-bold text-xs bg-amber-400 text-black hover:bg-amber-500 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSavingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
            <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-5 my-8 bg-zinc-900 border-zinc-800 text-white">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-emerald-400" />
                    J-STORE - Order Details #{selectedOrder.id}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-full hover:bg-neutral-800 font-bold"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border flex items-center justify-between bg-zinc-950 border-zinc-800">
                  <span className="text-gray-400 font-bold">Order Status</span>
                  <select value={selectedOrder.status || 'pending'} onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)} className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-700 cursor-pointer outline-none ${getStatusColorClass(selectedOrder.status)}`}>
                    <option value="pending" className="text-amber-500 font-bold bg-zinc-900">Pending</option>
                    <option value="completed" className="text-emerald-400 font-bold bg-zinc-900">Completed</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl border flex items-center justify-between bg-zinc-950 border-zinc-800">
                  <div>
                    <span className="text-gray-400 block mb-1">Customer Name</span>
                    <p className="font-extrabold text-sm">{selectedOrder.customer_name || 'General'}</p>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-400 block mb-1">Phone Number</span>
                    <a href={`tel:${selectedOrder.phone || ''}`} className="font-mono font-extrabold text-sm text-blue-400 underline">{selectedOrder.phone || '-'}</a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border bg-zinc-950 border-zinc-800">
                  <span className="text-gray-400 block mb-1">Delivery Address</span>
                  <p className="font-mono font-bold text-red-500">{selectedOrder.address || 'In-Store'}</p>
                </div>

                <div className="p-4 rounded-2xl border space-y-3 bg-zinc-950 border-zinc-800">
                  <h4 className="font-extrabold text-xs border-b pb-2 border-zinc-800">Order Items & Sizes:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedOrder && Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => {
                      const itemPrice = Number(item.price) || 0;
                      const itemQty = Number(item.qty) || 1;
                      const itemTotal = itemPrice * itemQty;
                      const itemSize = item.selectedSize || item.size || 'N/A';

                      return (
                        <div key={idx} className="flex justify-between items-center border-b border-zinc-800/50 pb-2 text-xs">
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono font-bold mt-1 inline-block">Size: {itemSize}</span>
                          </div>
                          <div className="font-mono font-bold">${itemPrice} × {itemQty} = <span className="text-emerald-400">${itemTotal}</span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border flex justify-between items-center font-black text-sm bg-zinc-950 border-zinc-800 text-zinc-100">
                  <span>Total Amount:</span>
                  <span className="text-lg font-black text-emerald-400">${selectedOrder.totals ?? selectedOrder.total}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-500 transition flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print Invoice</button>
                <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 rounded-xl font-bold text-xs transition border bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700">Close Card</button>
              </div>
            </div>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl border bg-zinc-900 border-zinc-800 text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-base">Confirm Sale</h3>
                <button onClick={() => setIsCheckoutOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handlePOSCheckout} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Customer Name *</label>
                  <input type="text" required value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-zinc-950 border-zinc-800 text-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Phone Number *</label>
                  <input type="tel" required value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-zinc-950 border-zinc-800 text-white outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-2">Payment Method:</label>
                  <div className="space-y-2">
                    {[{ id: 'Cash', label: 'Cash' }, { id: 'Syriatel Cash', label: 'Syriatel Cash' }, { id: 'Sham Cash', label: 'Sham Cash' }].map((pm) => (
                      <label key={pm.id} className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${customerInfo.paymentMethod === pm.id ? 'bg-zinc-800 border-zinc-600 text-white font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>
                        <input type="radio" name="posPayment" value={pm.id} checked={customerInfo.paymentMethod === pm.id} onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })} className="w-4 h-4 accent-white cursor-pointer" />
                        <span>{pm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {(customerInfo.paymentMethod === 'Syriatel Cash' || customerInfo.paymentMethod === 'Sham Cash') && (
                  <div>
                    <label className="text-xs font-bold block mb-1 text-emerald-400">Enter Transaction Code / Account No. *</label>
                    <input type="text" required placeholder="e.g. TX-984201" value={customerInfo.txCode} onChange={(e) => setCustomerInfo({ ...customerInfo, txCode: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-zinc-950 border-zinc-800 text-white outline-none font-mono" />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsCheckoutOpen(false)} disabled={isSubmittingOrder} className="px-4 py-3 rounded-xl font-bold text-xs bg-zinc-800 text-zinc-300">Cancel</button>
                  <button type="submit" disabled={isSubmittingOrder} className="flex-1 py-3 rounded-xl font-bold text-xs bg-white text-black flex items-center justify-center gap-2 cursor-pointer">
                    {isSubmittingOrder ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <span>Complete Sale</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPrintPrompt && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 no-print">
            <div className="w-full max-w-sm rounded-3xl p-6 text-center space-y-5 border bg-zinc-900 border-zinc-800 text-white">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-extrabold text-base">Sale Completed Successfully!</h3>
              <p className="text-xs text-zinc-400">Would you like to print the invoice for this order now?</p>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSkipPrint} className="flex-1 py-3 rounded-xl font-bold text-xs bg-zinc-800 text-zinc-300">No, Skip</button>
                <button onClick={handleConfirmPrint} className="flex-1 py-3 rounded-xl font-bold text-xs bg-emerald-600 text-white flex items-center justify-center gap-1.5"><Printer className="w-4 h-4" /> Print Invoice</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}