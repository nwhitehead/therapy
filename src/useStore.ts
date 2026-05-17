
import { ref, type Ref, watch } from 'vue';

export const position: Ref<number> = ref(Number(localStorage.getItem('position') ?? 0));
export const subposition: Ref<number> = ref(Number(localStorage.getItem('subposition') ?? 0));
export const meter: Ref<number> = ref(Number(localStorage.getItem('meter') ?? 1));
export const lie: Ref<number> = ref(Number(localStorage.getItem('lie') ?? 0.5));
export const noise: Ref<number> = ref(Number(localStorage.getItem('noise') ?? 0.8));
export const frequency: Ref<number> = ref(Number(localStorage.getItem('frequency') ?? 2.0));

watch(position, (newValue) => {
    localStorage.setItem('position', `${newValue}`);
});
watch(subposition, (newValue) => {
    localStorage.setItem('subposition', `${newValue}`);
});
watch(meter, (newValue) => {
    localStorage.setItem('meter', `${newValue ? 1 : 0}`);
});
watch(lie, (newValue) => {
    localStorage.setItem('lie', `${newValue}`);
});
watch(noise, (newValue) => {
    localStorage.setItem('noise', `${newValue}`);
});
watch(frequency, (newValue) => {
    localStorage.setItem('frequency', `${newValue}`);
});
