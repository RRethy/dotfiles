---
allowed-tools: Bash(git:*), Read
description: Amend the last commit with new changes and force push
---

1. **Check repository status**
   - Run `git status` to see uncommitted changes
   - Run `git diff` to review unstaged changes
   - Verify we're in a git repository
   - Check last commit: `git log -1 --oneline`

2. **Stage additional changes**
   - Add specific files: `git add <file1> <file2>`
   - Add all changes: `git add -A`
   - Review what will be amended: `git diff --staged`

3. **Amend the commit**
   - Keep the same commit message: `git commit --amend --no-edit`
   - Or change the commit message: `git commit --amend -m "<new message>"`
   - Message format: Keep it to one line, no co-author mentions
   - Examples: "Fix authentication bug", "Add missing tests", "Update API endpoint"

4. **Force push to remote**
   - Check current branch: `git branch --show-current`
   - Force push with lease (safer): `git push --force-with-lease origin <branch-name>`
   - Only use `git push --force` if you're certain no one else is working on the branch

5. **Important warnings**
   - Only amend commits that haven't been shared/merged
   - Never amend commits on main/master branch
   - Be careful when force pushing to shared branches
   - Inform teammates if amending shared commits

**Error handling:**
- If not in git repo: Exit gracefully
- If no commits to amend: Inform user to make initial commit first
- If push fails: Check if branch is protected
- If remote has diverged: Warn user before force pushing

**Best practices:**
- Only amend recent, unshared commits
- Use --force-with-lease instead of --force
- Review changes carefully before amending
- Consider creating a new commit instead if changes are significant