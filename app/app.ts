import { Application } from '@nativescript/core'
import { svelteNative } from 'svelte-native'
import App from './App.svelte'

svelteNative(App, {})
Application.run({ moduleName: 'app-root' })