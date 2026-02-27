import { presetForms } from "@julr/unocss-preset-forms"
import { defineConfig, presetWind3, presetIcons } from "unocss"

export default defineConfig({
	presets: [presetWind3(), presetForms(), presetIcons({
		collections: {
			lucide: () => import("@iconify-json/lucide/icons.json").then(i => i.default)
		}
	})]
})
