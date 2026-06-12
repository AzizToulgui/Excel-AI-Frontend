"use client";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ProductSection } from "@/components/product-section";
import { FloatingChatWidget } from "@/components/floating-chat-widget-shadcnui";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ProductSection />
      <FloatingChatWidget />
    </>
  );
}
