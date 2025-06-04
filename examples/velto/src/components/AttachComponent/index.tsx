import { Attach, ref, onMounted } from '@velto/runtime';
import styles from './styles.module.scss';

export default (props: Record<string, unknown>) => {
  const defer = ref(true);

  onMounted(() => {
    setTimeout(() => {
      defer.setValue(false)
    }, 3000)
  })

  return (
    <Attach to="body" disabled={ref(false)} defer={defer}>
      <div>hello world</div>
    </Attach>
  )
}