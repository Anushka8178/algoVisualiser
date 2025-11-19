# 🚀 Push to New GitHub Repository

Since we're having merge conflicts, here's how to push everything to a new repository:

## Step 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `algoVisualiser-v2` (or any name you prefer)
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Add New Remote and Push

Run these commands in your project directory:

```bash
# Add new remote (replace YOUR_USERNAME with your GitHub username)
git remote add new-origin https://github.com/Anushka8178/algoVisualiser-v2.git

# Push everything to new repo
git push new-origin main
```

## Step 3: Update Default Remote (Optional)

If you want to make the new repo your default:

```bash
# Remove old remote
git remote remove origin

# Rename new remote to origin
git remote rename new-origin origin

# Now 'git push' will push to the new repo
```

## Alternative: Force Push to Existing Repo

If you want to overwrite the existing repo:

```bash
git push origin main --force
```

⚠️ **Warning**: This will overwrite the remote repository. Only do this if you're sure!

