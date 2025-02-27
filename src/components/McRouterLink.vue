<template>
  <MCButton @click="handleClick">
    <slot></slot>
  </MCButton>
</template>

<script setup>
import MCButton from "./MCButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const handleClick = () => {
  if (props.to.startsWith("http://") || props.to.startsWith("https://")) {
    window.open(props.to, "_blank"); // Open the URL in a new tab
  } else {
    router.push(props.to); // Navigate using vue-router
  }
};
</script>
