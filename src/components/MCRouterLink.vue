<template>
  <MCButton :disabled="props.disabled" :length="props.length" @click="handleClick">
    <slot></slot>
  </MCButton>
</template>

<script setup lang="ts">
import MCButton from "./MCButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

interface Props {
  to: string
  disabled?: boolean
  length?: 'short' | 'medium' | 'long'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  length: 'long',
})

const handleClick = () => {
  if (props.to.startsWith("http://") || props.to.startsWith("https://")) {
    window.open(props.to, "_blank"); // Open the URL in a new tab
  } else {
    router.push(props.to); // Navigate using vue-router
  }
};
</script>
