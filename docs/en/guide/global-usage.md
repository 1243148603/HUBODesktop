# Global Usage (Run from Any Directory)


<<<<<<< HEAD
If you want to run `hubo` directly from any project directory, set up one of the following. Once configured, `hubo` will automatically recognize your current working directory.
=======
If you want to run `claude-haha` directly from any project directory, set up one of the following. Once configured, `claude-haha` will automatically recognize your current working directory.
>>>>>>> upstream/main

## macOS / Linux

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Option 1: Add to PATH (recommended)
<<<<<<< HEAD
export PATH="$HOME/path/to/hubo/bin:$PATH"

# Option 2: Alias
alias hubo="$HOME/path/to/hubo/bin/hubo"
=======
export PATH="$HOME/path/to/claude-code-haha/bin:$PATH"

# Option 2: Alias
alias claude-haha="$HOME/path/to/claude-code-haha/bin/claude-haha"
>>>>>>> upstream/main
```

Then reload the config:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

## Windows (Git Bash)

Add to `~/.bashrc`:

```bash
<<<<<<< HEAD
export PATH="$HOME/path/to/hubo/bin:$PATH"
=======
export PATH="$HOME/path/to/claude-code-haha/bin:$PATH"
>>>>>>> upstream/main
```

### Windows + WSL Toolchains

<<<<<<< HEAD
If `hubo` runs on Windows / Git Bash but tools such as Node, Python, uv, or bun are installed inside WSL, call them through WSL explicitly:
=======
If `claude-haha` runs on Windows / Git Bash but tools such as Node, Python, uv, or bun are installed inside WSL, call them through WSL explicitly:
>>>>>>> upstream/main

```bash
wsl -e bash -lc 'node --version && python3 --version'
```

<<<<<<< HEAD
When hubo detects `wsl` / `wsl.exe`, it automatically sets `MSYS2_ARG_CONV_EXCL=*` so Git Bash does not rewrite WSL paths such as `/home/...` into `C:/Program Files/Git/home/...`.
=======
When cc-haha detects `wsl` / `wsl.exe`, it automatically sets `MSYS2_ARG_CONV_EXCL=*` so Git Bash does not rewrite WSL paths such as `/home/...` into `C:/Program Files/Git/home/...`.
>>>>>>> upstream/main

To route Bash tool commands through WSL by default, set this before startup:

```bash
export CLAUDE_CODE_SHELL_PREFIX='wsl -e bash -lc'
```

Computer Use still controls Windows desktop apps. CLI tools running inside WSL do not need to be added to `computer-use-config.json`. If you only need the WSL toolchain and do not need desktop control, disable Computer Use with `--no-computer-use` or the Settings > Computer Use switch.

## Verify

After setup, navigate to any project directory and test:

```bash
cd ~/your-other-project
<<<<<<< HEAD
hubo
=======
claude-haha
>>>>>>> upstream/main
# Ask "What is the current directory?" — it should show ~/your-other-project
```
