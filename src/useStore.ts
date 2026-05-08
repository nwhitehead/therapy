
import { ref, type Ref, watch } from 'vue';

export const position: Ref<number> = ref(Number(localStorage.getItem('position') ?? 0));

watch(position, (newValue) => {
    localStorage.setItem('position', `${newValue}`);
});