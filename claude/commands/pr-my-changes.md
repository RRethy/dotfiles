---
allowed-tools: Bash(git:*), Bash(gh:*), Bash("test:*"), Bash("echo:*")
description: Create PR and branch with changes
---

1. **Check repository status**
   - Run `git status` to see uncommitted changes
   - Verify we're in a git repository

2. **Create descriptive branch**
   - Generate branch name based on changes (e.g., `feat/add-login`, `fix/header-bug`, `refactor/api-client`)
   - Create and switch to new branch: `git checkout -b <branch-name>`
   - If branch creation fails, keep going until a unique name is found

3. **Stage and commit changes**
   - Stage all changes: `git add -A`
   - Create commit with a short, concise, and descriptive message. Do not add a co-author and do not mention Claude Code. Keep it to one line.
   - Format: `<description>` (e.g., "Add user authentication", "Resolve memory leak")
   - Run `git commit -m "<message>"`

4. **Push to remote**
   - Push with upstream tracking: `git push -u origin <branch-name>`
   - Handle push failures (suggest force push only if safe)

5. **Create pull request**
   - Check for PR template: `test -f .github/pull_request_template.md || test -f .github/PULL_REQUEST_TEMPLATE.md || test -f docs/pull_request_template.md`
   - Create PR with: `gh pr create --title "<title>" --body "<description>"`
   - Options:
     - `--draft` if user wants draft PR
     - `--base <branch>` if not targeting main/master
   
6. **Finalize**
   - Get PR URL from output
   - Open PR in browser: `gh pr view --web`
   - Display PR number and URL to user

**Error handling:**
- If not in git repo: Exit gracefully
- If no changes: Inform user nothing to commit.
- If branch exists: Figure out a relevant branch name that doesn't exist
- If gh not authenticated: Prompt to run `gh auth login`
