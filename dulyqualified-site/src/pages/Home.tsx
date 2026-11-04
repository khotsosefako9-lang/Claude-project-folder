import BookCall from '../components/home/BookCall';
import EveryMonth from '../components/home/EveryMonth';
import Faq from '../components/home/Faq';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Pricing from '../components/home/Pricing';
import SampleTeaser from '../components/home/SampleTeaser';
import Paperwork from '../components/home/Paperwork';
import TenderRain from '../components/home/TenderRain';
import WhoFor from '../components/home/WhoFor';

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <EveryMonth />
      <TenderRain />
      <Paperwork />
      <WhoFor />
      <SampleTeaser />
      <Pricing />
      <Faq />
      <BookCall />
    </>
  );
}
