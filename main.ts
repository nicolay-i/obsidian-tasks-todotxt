import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {WorkspaceLeaf} from "obsidian";
import {VIEW_TYPE_EXAMPLE, ObsidianWidgetView} from 'ObsidianWidgetView'

// Remember to rename these classes and interfaces!

export interface MyPluginSettings {
	showSearch: boolean
	showFolders: boolean
	paddingX: string
	sortByAsc: boolean
	sortWithNumbers: boolean
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	showSearch: true,
	showFolders: true,
	paddingX: '10%',
	sortByAsc: true,
	sortWithNumbers: false,
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async activateView() {
		const {workspace} = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getLeaf(true);
			await leaf?.setViewState({type: VIEW_TYPE_EXAMPLE, active: true});
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}


	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ObsidianWidgetView(leaf)
		);

		this.addRibbonIcon("list-todo", "Open Tasks TXT", () => {
			this.activateView();
		});

		this.addCommand({
			id: 'list-todo',
			name: 'Open Tasks TXT',
			callback: () => {
				this.activateView();
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings')
			.setHeading()
			.setDesc('To apply changes reopen page index of files')

		new Setting(containerEl)
			.setName('Show search')
			.addToggle(async (value) => {
				value
					.setValue( this.plugin.settings.showSearch )
					.onChange(async (value) => {
						this.plugin.settings.showSearch = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(containerEl)
			.setName('Show folders')
			.addToggle(async (value) => {
				value
					.setValue( this.plugin.settings.showFolders )
					.onChange(async (value) => {
						this.plugin.settings.showFolders = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(containerEl)
			.setName('Horizontal padding')
			.setDesc('Example: 10, 20%, 30px, 40pt')
			.addText(text => text
				.setPlaceholder('Enter padding in px or percentage')
				.setValue(`${this.plugin.settings.paddingX}`)
				.onChange(async (value) => {
					this.plugin.settings.paddingX = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Sort by name asc')
			.addToggle(async (value) => {
				value
					.setValue( this.plugin.settings.sortByAsc )
					.onChange(async (value) => {
						this.plugin.settings.sortByAsc = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(containerEl)
			.setName('Sort with names as has number prefixes')
			.addToggle(async (value) => {
				value
					.setValue( this.plugin.settings.sortWithNumbers )
					.onChange(async (value) => {
						this.plugin.settings.sortWithNumbers = value;
						await this.plugin.saveSettings();
					})
			});
	}
}
