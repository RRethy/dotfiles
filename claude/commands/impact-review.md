---
allowed-tools: Bash(gh:*), Bash(date:*), WebFetch
description: Generate weekly GitHub activity summary for sharing accomplishments
---

1. **Determine time period**
   - Calculate date range (most recent Saturday to today by default)
   - Use `date` command to get specific dates
   - Allow user to specify custom date range if needed

2. **Gather GitHub activity**
   
   **Pull Requests created:**
   - Search PRs authored: `gh search prs --author=@me --created=">=YYYY-MM-DD" --json repository,number,title,url,createdAt,state,updatedAt --limit 100`
   - Note: Use `--created=">=YYYY-MM-DD"` (with equals sign, not colon)
   - Note: `gh pr list` requires being in a git repo, use `gh search prs` instead
   - Note merged vs open vs closed status
   
   **Pull Requests reviewed:**
   - Search for reviewed PRs: `gh search prs --reviewed-by=@me --created=">=YYYY-MM-DD" --json repository,number,title,url,createdAt,state --limit 100`
   - Get review details and outcomes
   
   **Pull Requests commented on:**
   - Search for PRs with comments: `gh search prs --commenter=@me --created=">=YYYY-MM-DD" --json repository,number,title,url,createdAt,state --limit 100`
   - Distinguish between review comments and general discussion
   
   **Issues involvement:**
   - Issues created: `gh search issues --author=@me --created=">=YYYY-MM-DD" --json repository,number,title,url,createdAt,state --limit 100`
   - Issues commented on: `gh search issues --commenter=@me --created=">=YYYY-MM-DD" --json repository,number,title,url,createdAt,state --limit 100`
   - Issues assigned: `gh search issues --assignee=@me --created=">=YYYY-MM-DD" --json repository,number,title,url,createdAt,state --limit 100`
   - Note: Use `gh search issues` instead of `gh issue list` to work outside git repos

3. **Calculate high-level statistics**
   - Count total merged PRs only (exclude open/draft PRs from stats)
   - Count unique repositories touched
   - Calculate daily activity average
   - Identify most active repository
   - Count total reviews performed
   
4. **Analyze impact**
   - Group activity by repository
   - Identify major contributions vs minor fixes (group related PRs)
   - Calculate code review velocity
   - Note cross-team collaboration
   - Extract PR titles, URLs, and repository names for detailed tracking
   - Group similar work (e.g., binary updates, dependency bumps) into single items
   - Focus on merged PRs only for Key Contributions section

5. **Generate summary**
   
   **Format for sharing (output as formatted markdown):**
   ```markdown
   ## Weekly Accomplishments (MM/DD - MM/DD)
   
   ### 📈 Quick Stats
   - **Merged PRs**: X PRs successfully merged
   - **Code Reviews**: Y PRs reviewed
   - **Active Repos**: X repositories
   - **Daily Average**: X contributions per day
   - **Most Active Repo**: repo-name (X contributions)
   
   ### 🚀 Key Contributions (Merged PRs)
   - **[Feature/Component Name]**: [Specific description of what was implemented/fixed]
     - [PR title] ([#PR](URL))
     - [PR title] ([#PR](URL))
   - Group related PRs together (e.g., all autoscaler changes, all kubectl-pi updates)
   - Consolidate repetitive updates (e.g., "Updated kubectl-pi binary 3 times" with links)
   - Only include merged PRs in this section
   
   ### 👥 Collaboration
   - Reviewed X pull requests across Y repositories
   
   ### 📊 Repository Breakdown
   - Repositories touched: [list with counts, e.g., infrastructure (15), system-controllers (8)]
   - Include both created and reviewed PRs in counts
   
   ### 🎯 Impact Highlights
   - [Specific business value with metrics if available]
   - [Technical improvements with affected systems/services]
   - [Team productivity gains with concrete examples]
   ```

6. **Output options**
   - Display formatted summary in terminal
   - Write to markdown file: `IMPACT_REVIEW-YYYY-MM-DD_YYYY-MM-DD.md` (start date to end date of period)
   - Example: `IMPACT_REVIEW-2025-08-02_2025-08-07.md`
   - File should contain the complete formatted markdown output
   - Inform user of file location after creation

**Customization:**
- Filter by specific repositories
- Focus on certain types of work (features, bugs, reviews)
- Adjust verbosity level
- Include or exclude personal repos

**Error handling:**
- If gh not authenticated: Prompt to run `gh auth login`
- If no activity found: Check date range and authentication
- If rate limited: Wait and retry with smaller queries
