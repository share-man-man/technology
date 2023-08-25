// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')

const div = document.createElement('div');
div.setAttribute('style', 'width:100px;height:100px;background-color:red');
div.innerHTML = 'aaaa';

document.getElementById('app')?.appendChild(div);
