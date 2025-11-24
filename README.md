## 🛠️ Development Setup

This project uses `uv` for fast package management.

### 1. Install `uv`

If you don't have `uv` installed yet, open your terminal and install it.

- macOS (Homebrew): `brew install uv`


### 2. Setup & Sync

Follow these steps to download the existing libraries and set up your environment.

1. Create the virtual environment: `uv venv`
2. Activate the environment (macOS / Linux): `source .venv/bin/activate`
3. Sync dependencies listed in the lockfile: `uv sync`

### Directory Tree

```
arabic_poetry_generator/
├─ datasets/
│  ├─ raw/
│  └─ processed/
├─ notebooks/
│  └─ data_preprocessing.ipynb
└─ README.md
```
