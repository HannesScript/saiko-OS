import './app.css'
import Load from './Load.svelte'

const app = new Load({
  target: document.getElementById('app')!,
})

export default app;
