'use client';

import React from 'react';
import { NavermapsProvider } from 'react-naver-maps';

const nest = (children: React.ReactNode, component: React.ReactElement) =>
  React.cloneElement(component, {}, children);

export type MultiProviderProps = React.PropsWithChildren<{
  providers: React.ReactElement[];
}>;

function MultiProvider({ children, providers }: MultiProviderProps) {
  return (
    <React.Fragment>{providers.reduceRight(nest, children)}</React.Fragment>
  );
}

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <MultiProvider
      providers={[
        <NavermapsProvider ncpClientId="z4wnztqz78" key="z4wnztqz78" />,
      ]}
    >
      {children}
    </MultiProvider>
  );
}
