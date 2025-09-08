import { defineAsyncComponent } from 'velto';
import styles from './styles.module.scss';

export default (props: Record<string, unknown>) => {
  const Comp = defineAsyncComponent({
    // @ts-expect-error
    loader: () => import('http://localhost:4173/test.js1'),
    loadingComponent: (props) => (<div> {props.name} loading</div>),
    errorComponent: (error) => (<div> {error.props.name} error</div>),
  });
  return (
    <div class={styles.asyncComponent}>
      <div>async component start </div>
      <Comp name="async component" />
      <div>async component end</div>
    </div>
  )
}