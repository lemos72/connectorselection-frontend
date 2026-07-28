import { getNewsItems } from '../../lib/strapi';
   import NewsCard from '../../components/NewsCard';

   export const metadata = {
     title: 'Industry News',
     description:
       'Curated industry news on connectors, FFC/FPC, board-to-board, EV, and data center interconnect topics.',
   };

   async function safe(fn, fallback) {
     try {
       return await fn();
     } catch (e) {
       console.warn('[build] fetch failed:', e.message);
       return fallback;
     }
   }

   export default async function NewsPage() {
     const newsItems = await safe(getNewsItems, []);

     return (
       <>
         <section className="cs-band">
           <div className="cs-container">
             <span className="cs-eyebrow">Industry Updates</span>
             <h1>News</h1>
             <p>
               Curated headlines from trusted electronics and connector industry
               publications — FFC, FPC, board-to-board, EV, semiconductor, and
               data center interconnect news.
             </p>
           </div>
         </section>

         <section className="cs-section">
           <div className="cs-container">
             {newsItems.length > 0 ? (
               <div className="cs-grid">
                 {newsItems.map((item) => (
                   <NewsCard key={item.id} item={item} />
                 ))}
               </div>
             ) : (
               <div className="cs-empty">
                 No news items yet. Check back soon.
               </div>
             )}
           </div>
         </section>
       </>
     );
   }