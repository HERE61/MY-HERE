'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { Input } from '@/components/ui/input';

export default function Header() {
  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4">
      <h1 className="text-2xl font-semibold">
        궁금했던 공간의 위치를 찾아보세요
      </h1>
      <div className="relative flex-grow md:max-w-[300px]">
        <Input
          onChange={onChange}
          value={value}
          className="text-1xl pl-10"
          type="text"
        />
        <Icon
          name="search"
          className="absolute inset-0 left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform"
        />
      </div>
    </div>
  );
}
