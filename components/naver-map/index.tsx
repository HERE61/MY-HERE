'use client';

import { NaverMap as Map, Container as MapDiv } from 'react-naver-maps';

export default function NaverMap() {
  return (
    <MapDiv
      style={{
        width: '100%',
        height: 'calc(100vh - 40px)',
      }}
    >
      <Map />
    </MapDiv>
  );
}
