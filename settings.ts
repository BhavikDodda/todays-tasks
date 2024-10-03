import { App, PluginSettingTab, Setting } from 'obsidian'
import type MyPlugin from "./main";

export interface MyPluginSettings {
	dataFile: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	dataFile: 'folder/replacements.md'
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.dataFile)
				.onChange(async (value) => {
					this.plugin.settings.dataFile = value;
					await this.plugin.saveSettings();
				}));
	}
}