import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { MenuManagement } from './components/menu/MenuManagement';
import { OrderManagement } from './components/orders/OrderManagement';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TablesView } from './components/tables/TablesView';
import { SettingsView } from './components/settings/SettingsView';
import { OrderDetailsModal } from './components/orders/OrderDetailsModal';
import { NewOrderModal } from './components/orders/NewOrderModal';
import './App.css';

const MainContent = () => {
  const { activeTab, orders } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const handleSelectOrderById = (orderId) => {
    const found = orders.find(o => o.id === orderId);
    if (found) {
      setSelectedOrder(found);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectOrder={setSelectedOrder}
            onOpenNewOrder={() => setIsNewOrderOpen(true)}
          />
        );
      case 'orders':
        return (
          <OrderManagement
            isNewOrderOpen={isNewOrderOpen}
            setIsNewOrderOpen={setIsNewOrderOpen}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        );
      case 'menu':
        return <MenuManagement />;
      case 'analytics':
        return <AnalyticsView />;
      case 'tables':
        return <TablesView onSelectOrderById={handleSelectOrderById} />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onSelectOrder={setSelectedOrder}
            onOpenNewOrder={() => setIsNewOrderOpen(true)}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Area */}
      <div className="main-area">
        <Header onOpenNewOrder={() => setIsNewOrderOpen(true)} />

        <main className="content-body">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <Toast />

      {activeTab !== 'orders' && (
        <>
          <OrderDetailsModal
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
          />
          <NewOrderModal
            isOpen={isNewOrderOpen}
            onClose={() => setIsNewOrderOpen(false)}
          />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <RestaurantProvider>
      <MainContent />
    </RestaurantProvider>
  );
}

export default App;
