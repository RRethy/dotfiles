---
allowed-tools: Bash(git:*), Bash(gh:*), Bash("test:*")
description: Create a PR description based on changed files and commit messages
---

1. **Check repository status**
   - Verify we're in a git repository: `git rev-parse --git-dir`
   - Get current branch: `git branch --show-current`
   - Identify base branch (main/master/develop): `git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'`

2. **Analyze changes**
   - Get diff statistics: `git diff --stat origin/<base>..HEAD`
   - Get detailed diff: `git diff origin/<base>..HEAD`
   - Get commit messages: `git log --oneline origin/<base>..HEAD`
   - Identify file types changed (code, docs, config)

3. **Check for PR template**
   - Look for template files:
     - `.github/pull_request_template.md`
     - `.github/PULL_REQUEST_TEMPLATE.md`
     - `docs/pull_request_template.md`
     - `.github/PULL_REQUEST_TEMPLATE/*.md`
   - If template exists: Parse sections and fill based on diff analysis
   - If no template: Use default format

4. **Generate PR description**
   
   **If template exists:**
   - Parse template sections and placeholders
   - Fill each section based on diff analysis
   - Preserve template structure and formatting
   
   **Default format (if no template):**
   
   **## Summary**
   - One-line description of what changed and why
   
   **## Changes**
   - Bullet list of specific changes grouped by area/component
   - Focus on "what" and "why", not implementation details
   
   **## Impact**
   - Breaking changes (if any)
   - Performance implications
   - Security considerations

5. **Update PR**
   - Display generated description
   - Ask user if PR should be updated with this description
   - If yes, update existing PR: `gh pr edit --body "<description>"`

**Error handling:**
- If not in git repo: Exit with clear message
- If no commits on branch: Inform user there are no changes
- If base branch unclear: Ask user to specify
- If diff too large: Summarize key changes only
