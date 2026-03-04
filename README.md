<div align="center">
  <h1>🚨 Error Sound Notifier</h1>
  <p><strong>A fun, full-featured Visual Studio Code extension that strictly keeps your code (and your terminal) in check!</strong></p>

  <p>
    <a href="https://github.com/ggauravky/error-sound-notifier/issues">Report Bug</a>
    ·
    <a href="https://github.com/ggauravky/error-sound-notifier/issues">Request Feature</a>
  </p>
</div>

---

> [!WARNING]  
> **18+ Disclaimer:** 
> This is a **fun project** originally created for entertainment, featuring slightly intense and humorous audio soundbites when an error occurs. Due to the nature of the audio responses, **viewer discretion is advised (18+)**. Please use headphones if you are in a professional environment! 🎧

## 🌟 About The Project

Tired of silently missing errors in your terminal while "watch" scripts compile? Bored of the usual dry red squiggly lines? 

**Error Sound Notifier** brings a much-needed, hilarious, and highly-attentive audio experience to your development workflow. It provides zero-dependency, real-time native audio feedback across all operating systems whenever you mess up your code or your build crashes.

### ✨ Key Features

- 🐛 **Editor Diagnostics:** Instantly plays an audio soundbite when you type real-time syntax or type errors in your open files.
- 💻 **Smart Terminal Streaming:** Natively hooks into VS Code `1.86+` Terminal Shell streams. It accurately detects words like `error`, `failed`, `exception`, and `traceback` in your live terminal tasks (like `npm run dev`)—even if the process never finishes!
- ⏱️ **Dual Anti-Spam Cooldown:** Features an intelligent, isolated tracking system. Your global editor cooldown prevents it from spamming while you type, while a separate terminal cooldown ensures script crashes don't overlap.
- 🎛️ **Quick Toggle UI:** A beautifully integrated status bar button (`🔊 / 🔇`) allows you to instantly silence the plugin when your boss walks by.

## 🚀 Getting Started

### Installation

Search for **Error Sound Notifier** in the VS Code Extensions Marketplace, or install it manually:

1. Download the `.vsix` package from the [Releases](https://github.com/ggauravky) tab.
2. Open VS Code, go to the Extensions view (`Ctrl+Shift+X`).
3. Click the `...` menu in the top right, and select **Install from VSIX**.
4. Restart your editor.

### Usage

Once installed, the extension is active by default! 

- **Editor Test:** Open a `.js` or `.ts` file and purposefully break the syntax (e.g., `const boom = ;`).
- **Terminal Test:** Open your integrated terminal and trigger an error (e.g., run `npm run non-existent-script`).

## ⚙️ Configuration

Open your VS Code Settings (`User Settings -> Extensions -> Error Sound Notifier`) to configure your chaos:

| Setting | Default | Description |
|---|---|---|
| `errorSoundNotifier.enabled` | `true` | Master switch to enable/disable all audio. |
| `errorSoundNotifier.listenToDiagnostics` | `true` | Should the extension listen to red squiggly editor errors? |
| `errorSoundNotifier.listenToTerminal` | `true` | Should the extension scan your live terminal tasks for crashes? |
| `errorSoundNotifier.volume` | `100` | The volume of the panic audio (0-100). |
| `errorSoundNotifier.cooldownMs` | `3000` | Minimum milliseconds to wait before yelling at you for an editor error again. |

## ⌨️ Commands

Access via the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- `Error Sound: Enable`
- `Error Sound: Disable`
- `Error Sound: Toggle Status`
- `Error Sound: Test Sound`

---

## 👨‍💻 Author

**Gaurav Kumar**

Got questions or want to connect? Check out my profiles:

- 💼 **LinkedIn:** [gauravky](https://www.linkedin.com/in/gauravky/)
- 💻 **GitHub:** [@ggauravky](https://github.com/ggauravky)
- 📸 **Instagram:** [@the_gau_rav](https://www.instagram.com/the_gau_rav/)
- 🏆 **LeetCode:** [gauravky](https://leetcode.com/u/gauravky/)
- 🧠 **GeeksforGeeks:** [gauravky](https://www.geeksforgeeks.org/profile/gauravky)

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
