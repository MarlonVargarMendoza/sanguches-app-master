import React from 'react';
import Hero from './components/Layout/Hero/Hero.jsx';
import { Productsjson } from './components/Product/sanguches/Products.jsx';
import { CartProvider } from './context/cart.jsx';

const App = () => {

  return (
    <CartProvider>
      <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[#FFC603]">
      {/* Navbar spacer - ajustado para diferentes breakpoints */}
        <div
          className="h-[60px] md:h-[120px] lg:h-[110px]"
          aria-hidden="true"
        />

        {/* Main content */}
        <main className="flex flex-col w-full flex-grow">
          <Hero />
          <section className="relative w-full">
            <Productsjson />
          </section>
        </main>
      </div>
    </CartProvider>
  );
};

export default App;