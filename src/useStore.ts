
import { ref, type Ref, watch } from 'vue';

export const position: Ref<number> = ref(Number(localStorage.getItem('position') ?? 0));
export const subposition: Ref<number> = ref(Number(localStorage.getItem('subposition') ?? 0));
export const meter: Ref<number> = ref(Number(localStorage.getItem('meter') ?? 1));

watch(position, (newValue) => {
    localStorage.setItem('position', `${newValue}`);
});
watch(subposition, (newValue) => {
    localStorage.setItem('subposition', `${newValue}`);
});
watch(meter, (newValue) => {
    localStorage.setItem('meter', `${newValue ? 1 : 0}`);
});
