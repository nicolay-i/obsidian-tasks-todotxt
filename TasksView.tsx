import {TAbstractFile, TFolder} from "obsidian";
import {useState} from "react";
import {MyPluginSettings} from "./main";

export const TasksView = function () {
	const files: TAbstractFile[] = this.app.vault.getMarkdownFiles()
	const [folderRoot, setFolderRoot] = useState<TFolder>(this.app.vault.getRoot())

	const [search, setSearch] = useState<string>('');
	const [folders, setFolders] = useState<string[]>([]);

	const lastFolder = folders.length ? folders[folders.length - 1] : '';

	const plugin: any = this.app.plugins.plugins['files-index'];
	const settings: MyPluginSettings = plugin.settings;

	function getNumberFromName(name: string) {
		return Number.parseInt((name.split('.').join('').split(' ')[0] + '000000').slice(0, 6));
	}

	let filesFilter = files
		.filter(file => folders.length ? file.parent?.name === lastFolder : true)
		.filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
		.map(file => ({...file, name: `${file.name}`}));

	filesFilter = filesFilter.sort((a: TAbstractFile, b: TAbstractFile) => {
		const nameA = settings.sortWithNumbers ? getNumberFromName(a.name) : a.name;
		const nameB = settings.sortWithNumbers ? getNumberFromName(b.name) : b.name;
		if (nameA < nameB) {
			return settings.sortByAsc ? -1 : 1;
		}
		if (nameA > nameB) {
			return settings.sortByAsc ? 1 : -1;
		}
		return 0;
	});

	function onClickByFile(file: TAbstractFile) {
		this.app.workspace.getLeaf().openFile(file);
	}



	return <div>
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore eaque fugit, impedit iste iure minima nesciunt non rem sapiente, suscipit totam, voluptatibus. A architecto dignissimos eius error impedit molestias sed!
	</div>;
};
