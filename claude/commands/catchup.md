---
allowed-tools: Bash(git:*), Read
description: Summarize project changes since user's last commit
---

1. **Check repository status**
   - Verify we're in a git repository: `git rev-parse --git-dir`
   - Get current branch: `git branch --show-current`
   - Check if user specified a directory/path to focus on

2. **Find user's last commit**
   - Get commit history with authors: `git log '--format=%H %an' -1000`
   - Identify first commit authored by user (Adam Regasz-Rethy or specified name)
   - If no commits found, check older history or inform user

3. **Analyze changes since last commit**
   
   **If specific directory/path provided:**
   - Get detailed log with diffs for path: `git log -p <user_last_commit>..HEAD -- <path>`
   - Get commit summary for path: `git log --oneline <user_last_commit>..HEAD -- <path>`
   - Get file change statistics for path: `git diff --stat <user_last_commit>..HEAD -- <path>`
   
   **If analyzing entire repository:**
   - Get detailed log with diffs: `git log -p <user_last_commit>..HEAD`
   - Get commit summary: `git log --oneline <user_last_commit>..HEAD`
   - Get file change statistics: `git diff --stat <user_last_commit>..HEAD`
   
   **Common analysis:**
   - Identify key contributors: `git shortlog -sn <user_last_commit>..HEAD`

4. **Categorize changes**
   - Group commits by area/component
   - Identify major features added
   - Note bug fixes and improvements
   - Highlight breaking changes
   - Track dependency updates

5. **Generate narrative summary**
   - **Overview**: Time period and number of commits
   - **Scope**: Entire repository or specific directory analyzed
   - **Key Changes**: Major features and improvements
   - **Contributors**: Who made changes and their focus areas
   - **File Impact**: Most modified areas of codebase
   - **Notable Patterns**: Refactoring trends, new patterns introduced
   - **Action Items**: Any TODOs or FIXMEs added

6. **Additional context**
   - Check for new branches created
   - Note any merge commits from feature branches
   - Identify PR merges if using GitHub flow

**Output format:**
- Start with high-level summary
- Progress to detailed changes by category
- End with actionable insights or areas needing attention

**Error handling:**
- If not in git repo: Exit with clear message
- If user has no commits: Summarize all recent changes
- If no changes since last commit: Report repository is up to date
- If specified path doesn't exist: Inform user and offer to analyze entire repo