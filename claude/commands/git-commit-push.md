---
allowed-tools: Bash(git:*), Read
description: Stage, commit, and push changes to the remote repository
---

1. **Check repository status**
   - Run `git status` to see untracked files and changes
   - Run `git diff` to review unstaged changes
   - Run `git diff --staged` to review staged changes
   - Verify we're in a git repository

2. **Stage changes**
   - Add specific files: `git add <file1> <file2>`
   - Add all changes: `git add -A`
   - Add with interactive review: `git add -p`

3. **Review commit readiness**
   - Verify staged changes: `git status`
   - Check for sensitive information (passwords, API keys, secrets)
   - Ensure no debug code or console.logs are included

4. **Create commit**
   - Run `git log -3 --oneline` to see recent commit style
   - Create commit with a short, concise, and descriptive message
   - Keep it to one line, no co-author mentions
   - Format: `git commit -m "<description>"`
   - Examples: "Add user authentication", "Fix memory leak in parser", "Update dependencies"

5. **Push to remote**
   - Check current branch: `git branch --show-current`
   - Push to remote: `git push origin <branch-name>`
   - If new branch: `git push -u origin <branch-name>`
   - Force push (use with caution): `git push --force-with-lease`

**Error handling:**
- If not in git repo: Exit gracefully
- If no changes: Inform user nothing to commit
- If push fails: Suggest solutions (pull first, force push if safe)
- If remote doesn't exist: Prompt to set upstream

**Best practices:**
- Write clear, concise commit messages
- Group related changes in single commits
- Never commit sensitive information
- Test changes before committing
- Use conventional commit format when applicable (feat, fix, docs, chore)
