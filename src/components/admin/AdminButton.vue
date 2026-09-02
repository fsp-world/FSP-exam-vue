<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'default' | 'primary' | 'danger';
type Size = 'small' | 'medium' | 'large';

interface Props {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  disabled: false,
});

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded border font-medium whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-40';
  const sizeClasses = {
    small: 'px-2.5 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-2.5 text-base',
  }[props.size];
  const variantClasses = {
    default: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
    primary: 'border-[#5268bc] bg-[#5268bc] text-white hover:bg-[#4354a3]',
    danger: 'border-red-300 bg-white text-red-500 hover:bg-red-50',
  }[props.variant];
  return `${base} ${sizeClasses} ${variantClasses}`;
});
</script>

<template>
  <button type="button" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
