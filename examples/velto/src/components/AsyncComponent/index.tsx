import { defineAsyncComponent } from '@velto/runtime';
import styles from './styles.module.scss';

export default (props: Record<string, unknown>) => {
  const Comp = defineAsyncComponent({
    loader: () => import('http://localhost:4173/test.js1'),
    loadingComponent: (props) => (<div> {props.name} loading</div>),
    errorComponent: (props) => (<div> {props.name} error</div>),
  });
  return (
    <div class={styles.asyncComponent}>
      <div>async component start </div>
      <Comp name="async component" />
      <div>async component end</div>
    </div>
  )
}