import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { exec } from 'child_process';

interface OrgCaptureSettings {
	emacsclientPath: string;
}

const DEFAULT_SETTINGS: OrgCaptureSettings = {
	emacsclientPath: 'emacsclient'
}


export default class OrgCapture extends Plugin {
	settings: OrgCaptureSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'org-capture-current-note',
			name: 'Capture current note to Emacs Org-mode',
			callback: () => {
				this.captureCurrentNote();
			}
		});

		this.addCommand({
			id: 'org-journal-capture-current-node',
			name: 'Insert last captured link into Emacs Org-Journal',
			callback: () => {
				this.insertLastStoredLink();
			}
		});

		this.addSettingTab(new OrgCaptureSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	captureCurrentNote() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('No active file');
			return;
		}

		const title = activeFile.basename;
		const vaultName = this.app.vault.getName();
		const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(activeFile.path)}`;
		const orgLink = `[[${obsidianUrl}][${title}]]`;

		const command = `${this.settings.emacsclientPath} -e '(add-to-list '"'"'org-stored-links (list "${obsidianUrl}" "${title}"))'`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				new Notice(`Error running emacsclient: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
                // Sometimes emacsclient prints non-error messages to stderr, so we might not want to always show a notice
                // new Notice(`emacsclient stderr: ${stderr}`);
			}
			console.log(`stdout: ${stdout}`);
			new Notice(`Captured link for: ${title}`);
		});
	}

	insertLastStoredLink() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('No active file');
			return;
		}

		const title = activeFile.basename;
		const vaultName = this.app.vault.getName();
		const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(activeFile.path)}`;
		const orgLink = `[[${obsidianUrl}][${title}]]`;

		const command = `${this.settings.emacsclientPath} -e '(progn (add-to-list '"'"'org-stored-links (list "${obsidianUrl}" "${title}")) (org-journal-new-entry nil) (org-insert-last-stored-link 1))'`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				new Notice(`Error running emacsclient: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
                // Sometimes emacsclient prints non-error messages to stderr, so we might not want to always show a notice
                // new Notice(`emacsclient stderr: ${stderr}`);
			}
			console.log(`stdout: ${stdout}`);
			new Notice(`Captured link for: ${title}`);
		});
	}
}

class OrgCaptureSettingTab extends PluginSettingTab {
	plugin: OrgCapture;

	constructor(app: App, plugin: OrgCapture) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Org Capture Settings'});

		new Setting(containerEl)
			.setName('Emacsclient Path')
			.setDesc('The path to your emacsclient executable.')
			.addText(text => text
				.setPlaceholder('Enter path')
				.setValue(this.plugin.settings.emacsclientPath)
				.onChange(async (value) => {
					this.plugin.settings.emacsclientPath = value;
					await this.plugin.saveSettings();
				}));
	}
} 