import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import { useProductCatalogFilter } from './hooks/useProductCatalogFilter';
import { TopAnnouncementBar } from './components/common/TopAnnouncementBar';
import { MainHeaderNavigation } from './components/common/MainHeaderNavigation';
import { MainFooterSection } from './components/common/MainFooterSection';
import { MobileBottomNavigationBar } from './components/common/MobileBottomNavigationBar';
import { FlyingCartAnimationOverlay } from './components/common/FlyingCartAnimationOverlay';
import { CartToastNotification } from './components/common/CartToastNotification';
import { AppErrorBoundary } from './components/common/AppErrorBoundary';
import { HeroCommercialBanner } from './components/home/HeroCommercialBanner';
import { DepartmentGridShowcase } from './components/home/DepartmentGridShowcase';
import { HomeFeaturedProductsPreview } from './components/home/HomeFeaturedProductsPreview';
import { StoreCatalogPage } from './components/pages/StoreCatalogPage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { CartDrawerModal } from './components/cart/CartDrawerModal';
import { HowToBuyFloatingButton } from './components/common/HowToBuyFloatingButton';
import { FloatingCartQuickButton } from './components/common/FloatingCartQuickButton';
import productsCatalogData from './data/productsCatalogData.json';

const StorefrontContent = () => {
  const [activePageIdentifier, setActivePageIdentifier] = useState('inicio');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [storeInitialDepartmentKey, setStoreInitialDepartmentKey] = useState('todos');

  const {
    searchQueryString,
    updateSearchQuery
  } = useProductCatalogFilter();

  useEffect(() => {
    AOS.init({
      duration: 650,
      once: true,
      easing: 'ease-out-cubic',
      offset: 40
    });

    const parseCurrentHash = () => {
      const currentRawHash = window.location.hash.replace('#', '').toLowerCase();
      if (currentRawHash.startsWith('producto-')) {
        const candidateProductSlug = currentRawHash.replace('producto-', '');
        const matchedProductItem = productsCatalogData.find(
          (catalogProduct) => catalogProduct.productIdentifier === candidateProductSlug
        );
        if (matchedProductItem) {
          setSelectedProductDetail(matchedProductItem);
          setActivePageIdentifier('producto');
          return;
        }
      }

      if (currentRawHash === 'tienda') {
        setActivePageIdentifier('tienda');
        setSelectedProductDetail(null);
      } else if (currentRawHash === 'nosotros') {
        setActivePageIdentifier('nosotros');
        setSelectedProductDetail(null);
      } else if (currentRawHash === 'contacto' || currentRawHash === 'contactanos') {
        setActivePageIdentifier('contacto');
        setSelectedProductDetail(null);
      } else {
        setActivePageIdentifier('inicio');
        setSelectedProductDetail(null);
      }
    };

    parseCurrentHash();
    window.addEventListener('hashchange', parseCurrentHash);
    return () => {
      window.removeEventListener('hashchange', parseCurrentHash);
    };
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [activePageIdentifier]);

  const handleNavigateToPage = (targetPageKey) => {
    setSelectedProductDetail(null);
    setActivePageIdentifier(targetPageKey);
    window.location.hash = targetPageKey === 'inicio' ? '' : targetPageKey;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDepartmentSelectFromHome = (chosenDepartmentIdentifier) => {
    setStoreInitialDepartmentKey(chosenDepartmentIdentifier);
    handleNavigateToPage('tienda');
  };

  const handleSelectProduct = (chosenProductItem) => {
    setSelectedProductDetail(chosenProductItem);
    setActivePageIdentifier('producto');
    window.location.hash = `producto-${chosenProductItem.productIdentifier}`;
  };

  const handleBackToStore = () => {
    setSelectedProductDetail(null);
    setActivePageIdentifier('tienda');
    window.location.hash = 'tienda';
  };

  const mainTopPaddingClass = (activePageIdentifier === 'tienda' || activePageIdentifier === 'producto')
    ? 'pt-[164px] sm:pt-[150px] lg:pt-[116px]'
    : 'pt-[164px] sm:pt-[150px] lg:pt-[116px]';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="fixed top-0 left-0 w-full z-40 bg-white lg:shadow-none shadow-xs">
        <TopAnnouncementBar />
        <MainHeaderNavigation
          searchQueryString={searchQueryString}
          onSearchChange={updateSearchQuery}
          activePageIdentifier={activePageIdentifier === 'producto' ? 'tienda' : activePageIdentifier}
          onNavigateToPage={handleNavigateToPage}
          onSelectDepartment={handleDepartmentSelectFromHome}
          storeInitialDepartmentKey={storeInitialDepartmentKey}
        />
      </header>

      <main className={`w-full ${mainTopPaddingClass} pb-20 lg:pb-0 flex-1`}>
        {activePageIdentifier === 'inicio' && (
          <>
            <HeroCommercialBanner onExploreCatalog={() => handleNavigateToPage('tienda')} />

            <div id="departamentos" className="w-full">
              <DepartmentGridShowcase
                onSelectDepartment={handleDepartmentSelectFromHome}
              />
            </div>

            <HomeFeaturedProductsPreview
              onNavigateToStore={handleNavigateToPage}
              onSelectProduct={handleSelectProduct}
            />
          </>
        )}

        {activePageIdentifier === 'tienda' && (
          <StoreCatalogPage
            initialDepartmentKey={storeInitialDepartmentKey}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePageIdentifier === 'nosotros' && (
          <AboutUsPage onNavigateToStore={() => handleNavigateToPage('tienda')} />
        )}

        {activePageIdentifier === 'contacto' && (
          <ContactUsPage />
        )}

        {activePageIdentifier === 'producto' && selectedProductDetail && (
          <ProductDetailPage
            productItem={selectedProductDetail}
            onBackToStore={handleBackToStore}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      <MainFooterSection />

      <FlyingCartAnimationOverlay />

      <MobileBottomNavigationBar
        activePageIdentifier={activePageIdentifier}
        onNavigateToPage={handleNavigateToPage}
        onSelectProduct={handleSelectProduct}
      />

      <CartToastNotification />

      <CartDrawerModal />

      <FloatingCartQuickButton />

      <div className="hidden lg:block">
        <HowToBuyFloatingButton />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <ShoppingCartProvider>
        <StorefrontContent />
      </ShoppingCartProvider>
    </AppErrorBoundary>
  );
}
