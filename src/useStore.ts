
import { ref, type Ref, watch } from 'vue';

export const position: Ref<number> = ref(Number(localStorage.getItem('position') ?? 0));
export const subposition: Ref<number> = ref(Number(localStorage.getItem('subposition') ?? 0));

watch(position, (newValue) => {
    localStorage.setItem('position', `${newValue}`);
});
watch(subposition, (newValue) => {
    localStorage.setItem('subposition', `${newValue}`);
});
