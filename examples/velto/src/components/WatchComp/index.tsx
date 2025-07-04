import { watch, ref } from 'velto';
import styles from './styles.module.scss';

export default function TestComp() {
  const count = ref(0);

  watch(() => count.value, () => {
    console.log('++++++count change immediate once', count.value, count)
  }, { immediate: true, once: true })

  const handle = watch(() => count.value, (newValue, oldValue) => {
    console.log('++++++count change ', count.value, count, newValue, oldValue)
  })

  return (
    <div class={styles.wrap}>
      <button onClick={() => count.setValue(count.value + 1)}>count</button>
      <button onClick={() => handle.pause()}>pause</button>
      <button onClick={() => handle.resume()}>resume</button>
      <button onClick={() => handle.stop()}>stop</button>
      <div>count: {count.value}</div>
    </div>
  )
}