# Obsidian Org Capture

This plugin allows you to capture links to your Obsidian notes and send them to Emacs for use with org-mode, specifically designed for integration with `org-stored-links` and `org-journal`.

## Features

This plugin provides two commands:

1.  **Capture current note to Emacs Org-mode**:
    *   Takes the title and Obsidian URL (`obsidian://...`) of the currently active note.
    *   Executes `emacsclient` to add the link to the `org-stored-links` list in your Emacs session using `(add-to-list 'org-stored-links (list "URL" "TITLE"))`.
    *   This makes the link available for insertion using standard org-mode link insertion commands (like `org-insert-link`).

2.  **Insert last captured link into Emacs Org-Journal**:
    *   Takes the title and Obsidian URL of the currently active note.
    *   Executes `emacsclient` to:
        *   Add the link to `org-stored-links` (same as the first command).
        *   Create a new entry in `org-journal` using `(org-journal-new-entry nil)`.
        *   Insert the captured link into the newly created journal entry using `(org-insert-last-stored-link 1)`.
    *   This provides a quick way to create a journal entry about the current Obsidian note.

## Requirements

*   **Obsidian**: The plugin requires Obsidian v0.12.0 or later.
*   **Emacs**: You need Emacs installed.
*   **Emacs Server**: The Emacs server must be running (`M-x server-start` in Emacs).
*   **`emacsclient`**: The `emacsclient` executable must be available. The plugin attempts to use `emacsclient` by default, but you can configure the full path in the plugin settings if needed.
*   **`org-mode`**: Required in Emacs for link storage and insertion.
*   **`org-journal`**: Required in Emacs *only if* you intend to use the "Insert last captured link into Emacs Org-Journal" command.

## Installation

1.  Download the `main.js`, `manifest.json`, and `styles.css` (if present) from the [Releases page](https://github.com/your-username/obsidian-org-capture/releases) of this repository. (Replace with your actual repo URL).
2.  Create a new folder named `obsidian-org-capture` inside your Obsidian vault's plugins folder (`<YourVault>/.obsidian/plugins/`).
3.  Copy the downloaded files into the `obsidian-org-capture` folder.
4.  In Obsidian, go to `Settings` -> `Community plugins`.
5.  Make sure "Safe mode" is **off**.
6.  Find "Org Capture" in the list of installed plugins and enable it.

## Configuration

Go to `Settings` -> `Community plugins` -> `Org Capture` (click the gear icon or find "Org Capture" under "Plugin Options" in the sidebar).

*   **Emacsclient Path**: If the `emacsclient` command is not in your system's default PATH, specify the full path to the executable here (e.g., `/usr/local/bin/emacsclient` or `/Applications/Emacs.app/Contents/MacOS/bin/emacsclient`).

## Usage

1.  Open the note in Obsidian that you want to capture.
2.  Open the Command Palette (default `Cmd+P` on macOS, `Ctrl+P` on Windows/Linux).
3.  Type "Org Capture" or "Org-Journal" to find the commands:
    *   Select **Capture current note to Emacs Org-mode** to just store the link in Emacs.
    *   Select **Insert last captured link into Emacs Org-Journal** to store the link, create a new journal entry, and insert the link there.
4.  A notification will appear in Obsidian confirming the action or reporting an error if `emacsclient` fails.

## Building from Source (Optional)

1.  Clone this repository.
2.  Navigate to the repository directory in your terminal.
3.  Run `npm install` to install dependencies.
4.  Run `npm run build` to compile the TypeScript code into `main.js`.
5.  Copy `main.js` and `manifest.json` to your vault's plugin directory (`<YourVault>/.obsidian/plugins/obsidian-org-capture/`).

## Author

Your Name (Update this in `manifest.json`)

## License

MIT
