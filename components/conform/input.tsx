import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { FieldMetadata } from '@conform-to/react';
import { getInputProps } from '@conform-to/react';
import { Eye, EyeOff } from 'lucide-react';
import { type ComponentProps, useState } from 'react';

export function InputConform({
  meta,
  type,
  ...props
}: {
  meta: FieldMetadata<string>;
  type: Parameters<typeof getInputProps>[1]['type'];
} & ComponentProps<typeof Input>) {
  return (
    <Input
      {...getInputProps(meta, { type, ariaAttributes: true })}
      {...props}
    />
  );
}

export function PasswordInputConfirm({
  meta,
  ...props
}: {
  meta: FieldMetadata<string>;
} & ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        {...getInputProps(meta, {
          type: showPassword ? 'text' : 'password',
          ariaAttributes: true,
        })}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={props.value === '' || props.disabled}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye name="eye" className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </Button>
    </div>
  );
}
