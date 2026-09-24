import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  INITIAL_EXPENSES,
  SALES_CHART_DATA
} from '../data/mockData';

const RestaurantContext = createContext();

const STORAGE_KEYS = {
  THEME: 'savor_restaurant_theme',
  MENU: 'savor_restaurant_menu',
  ORDERS: 'savor_restaurant_orders',
  TABLES: 'savor_restaurant_tables',
  EXPENSES: 'savor_restaurant_expenses'
};

export const RestaurantProvider = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'dark'; // default to dark modern theme for upscale vibe
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu items state
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Tables state
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  // Expenses state
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Table 4 waiter requested bill printing", time: "2m ago", unread: true },
    { id: 2, text: "Order ORD-9419 placed by Emma Watson-Lee", time: "8m ago", unread: true },
    { id: 3, text: "Kitchen reached peak capacity (4 orders prepping)", time: "18m ago", unread: false }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Menu operations
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: `item-${Date.now()}`,
      price: parseFloat(item.price) || 0,
      cost: parseFloat(item.cost) || 0,
      prepTime: parseInt(item.prepTime, 10) || 15,
      calories: parseInt(item.calories, 10) || 450,
      rating: 5.0,
      ordersCount: 0,
      inStock: item.inStock !== false,
      tags: item.tags || []
    };
    setMenuItems(prev => [newItem, ...prev]);
    addToast('Item Created', `${newItem.name} was added to the menu!`, 'success');
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              ...updatedFields,
              price: parseFloat(updatedFields.price !== undefined ? updatedFields.price : item.price),
              cost: parseFloat(updatedFields.cost !== undefined ? updatedFields.cost : item.cost),
              prepTime: parseInt(updatedFields.prepTime !== undefined ? updatedFields.prepTime : item.prepTime, 10),
              calories: parseInt(updatedFields.calories !== undefined ? updatedFields.calories : item.calories, 10)
            }
          : item
      )
    );
    addToast('Menu Updated', 'Item details saved successfully.', 'success');
  };

  const deleteMenuItem = (id) => {
    const target = menuItems.find(i => i.id === id);
    setMenuItems(prev => prev.filter(item => item.id !== id));
    addToast('Item Deleted', `${target?.name || 'Item'} has been removed.`, 'info');
  };

  const toggleStock = (id) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.inStock;
          addToast(
            nextState ? 'Back in Stock' : 'Marked Out of Stock',
            `${item.name} is now ${nextState ? 'available' : 'unavailable'} for ordering.`,
            nextState ? 'success' : 'warning'
          );
          return { ...item, inStock: nextState };
        }
        return item;
      })
    );
  };

  // Orders operations
  const createOrder = (orderData) => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `ORD-${orderNum}`,
      customer: {
        name: orderData.customerName || "Walk-in Guest",
        phone: orderData.customerPhone || "N/A",
        email: orderData.customerEmail || "guest@dine.com",
        avatar: `https://images.unsplash.com/photo-${1534528741775 + orderNum % 500}?auto=format&fit=crop&w=150&q=80`
      },
      type: orderData.type || "Dine-In",
      tableNumber: orderData.tableNumber || null,
      deliveryAddress: orderData.deliveryAddress || null,
      status: "Pending",
      paymentMethod: orderData.paymentMethod || "Credit Card",
      paymentStatus: "Paid",
      items: orderData.items || [],
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      discount: orderData.discount || 0,
      total: orderData.total,
      createdAt: new Date().toISOString(),
      estimatedMinutes: 20
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update table if dine in
    if (orderData.type === 'Dine-In' && orderData.tableNumber) {
      setTables(prev =>
        prev.map(tbl =>
          tbl.name === orderData.tableNumber
            ? { ...tbl, status: 'Occupied', activeOrder: newOrder.id }
            : tbl
        )
      );
    }

    // Update item order counts
    setMenuItems(prev =>
      prev.map(item => {
        const orderedItem = orderData.items.find(i => i.id === item.id);
        if (orderedItem) {
          return { ...item, ordersCount: (item.ordersCount || 0) + orderedItem.quantity };
        }
        return item;
      })
    );

    addToast('Order Placed', `Order #${newOrder.id} has been sent to the kitchen!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );

    // If delivered or cancelled, release table if applicable
    if (newStatus === 'Delivered' || newStatus === 'Cancelled') {
      const order = orders.find(o => o.id === orderId);
      if (order?.tableNumber) {
        setTables(prev =>
          prev.map(tbl =>
            tbl.name === order.tableNumber && tbl.activeOrder === orderId
              ? { ...tbl, status: 'Available', activeOrder: null }
              : tbl
          )
        );
      }
    }

    addToast('Status Updated', `Order ${orderId} moved to ${newStatus}`, 'info');
  };

  const cancelOrder = (orderId, reason = 'Cancelled by manager') => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'Cancelled', cancelReason: reason, paymentStatus: 'Refunded' }
          : order
      )
    );
    const order = orders.find(o => o.id === orderId);
    if (order?.tableNumber) {
      setTables(prev =>
        prev.map(tbl =>
          tbl.name === order.tableNumber && tbl.activeOrder === orderId
            ? { ...tbl, status: 'Available', activeOrder: null }
            : tbl
        )
      );
    }
    addToast('Order Cancelled', `Order ${orderId} was cancelled.`, 'warning');
  };

  const resetToDefaultData = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setTables(INITIAL_TABLES);
    setExpenses(INITIAL_EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    addToast('Reset Complete', 'Default mock data has been restored!', 'info');
  };

  // Calculations & KPIs
  const nonCancelledOrders = orders.filter(o => o.status !== 'Cancelled');
  const baseHistoricalSales = 24150.0;
  const currentOrdersSales = nonCancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalSales = baseHistoricalSales + currentOrdersSales;

  const baseHistoricalOrders = 1276;
  const totalOrdersCount = baseHistoricalOrders + orders.length;

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 4500); // 4500 base fixed costs
  const netProfit = totalSales - totalExpenses;
  const profitMargin = ((netProfit / totalSales) * 100).toFixed(1);

  const activeOrdersCount = orders.filter(
    o => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready'
  ).length;

  return (
    <RestaurantContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        searchQuery,
        setSearchQuery,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleStock,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        tables,
        setTables,
        expenses,
        salesChartData: SALES_CHART_DATA,
        notifications,
        setNotifications,
        toasts,
        addToast,
        removeToast,
        resetToDefaultData,
        // Computed stats
        totalSales,
        totalOrdersCount,
        totalExpenses,
        netProfit,
        profitMargin,
        activeOrdersCount
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
