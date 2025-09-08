import { renderToString } from '@velto/server'
import App from './App.tsx';

export async function render(_url) {
  const ctx = {}
  const html = renderToString(App, ctx)

  return { html }
}