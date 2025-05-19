import { AIRecommendationSection } from '@/components/landing/AIRecommendationSection'
import { BecomeVendor } from '@/components/landing/BecomeVendor'
import { HeroSection } from '@/components/landing/HeroSection'
import { Testimonials } from '@/components/landing/Testimonials'
import { TopVendors } from '@/components/landing/TopVendors'
import { VendorCategories } from '@/components/landing/VendorCategories'
import { NextPage } from 'next'
import React from 'react'

const landingPage : NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <HeroSection />
    <VendorCategories />
    <AIRecommendationSection />
    <TopVendors />
    <Testimonials />
    <BecomeVendor />
  </div>
  )
}

export default landingPage