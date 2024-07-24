import NaverMap from '@/components/naver-map';

import Header from './header';

// const getData = async () => {
//   const sql = neon(process.env.NEON_DATABASE_URL);
//   const db = drizzle(sql);
//   return db.select().from(productsTable).execute();
// };

export default async function SearchLocationPage() {
  return (
    <div>
      <Header />
      <NaverMap />
      {/* {JSON.stringify(data)} */}
    </div>
  );
}
