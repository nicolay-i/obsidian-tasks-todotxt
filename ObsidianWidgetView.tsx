import { StrictMode } from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { TasksView } from "./TasksView";
import {App} from "./App";

export const VIEW_TYPE_EXAMPLE = "obisidian-task-txt-view";

export class ObsidianWidgetView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Tasks TXT";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<App />
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}


