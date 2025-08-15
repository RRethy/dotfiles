---
allowed-tools: Bash(git:*), Read, Edit, MultiEdit
description: Show git diff and remove any code comments that were added
---

1. **Show current changes**
   - Run `git diff` to see unstaged changes
   - Or run custom diff command if specified by user
   - Common alternatives:
     - `git diff --staged` for staged changes
     - `git diff HEAD` for all changes vs last commit
     - `git diff <branch>` to compare with another branch
   - Check if user wants to preserve test comments (look for "keep test" or "preserve test" in request)

2. **Identify added comments**
   - Look for Go comment patterns in the diff output:
     - Single-line: `// comment`
     - Multi-line: `/* comment */`
     - Package comments: `// Package ...`
     - Function/type documentation: `// FunctionName ...`
   - Focus on lines starting with `+` (additions)
   - Common Go comment patterns to remove:
     - `// TODO:`, `// FIXME:`, `// DEBUG:`
     - `// This function...` (obvious explanations)
     - Commented-out code with `//`

3. **Remove comments from files**
   - For each file with added comments:
     - Read the file to understand context
     - Remove only the newly added comments
     - Preserve existing comments that were already there
     - Maintain proper code formatting and indentation
   - **Special handling for test files (*_test.go)**:
     - If user requests to keep test comments, review them for usefulness
     - Keep: Test case descriptions, setup explanations, assertion clarifications
     - Remove: Obvious comments like `// run test`, `// check error`

4. **Verify changes**
   - Run `git diff` again to show the cleaned changes
   - Ensure only comments were removed, not code
   - Check that file still functions correctly

5. **Summary**
   - Report number of comments removed
   - List files that were cleaned
   - Show final diff if requested

**Go-specific patterns to remove:**
- Debug comments: `// TODO:`, `// DEBUG:`, `// FIXME:`, `// HACK:`
- Obvious comments: `// increment counter`, `// return error`
- Commented-out code blocks with `//`
- Auto-generated comments that don't add value
- Redundant comments that repeat the code

**Go patterns to keep:**
- Package documentation: `// Package xyz provides...`
- Exported function/type docs: `// FunctionName does...`
- License headers at top of files
- Interface documentation
- Complex algorithm explanations
- `//go:generate` directives
- `//nolint` or `//lint:ignore` directives
- Build tags: `//go:build` or `// +build`

**Test comment patterns to keep (when preserving):**
- Test case descriptions: `// Test that user can login with valid credentials`
- Table test descriptions: `// case: invalid email format`
- Setup context: `// Create mock server with custom handler`
- Complex assertion explanations: `// Should retry 3 times before failing`
- Edge case explanations: `// Tests behavior when database is unavailable`

**Error handling:**
- If no changes found: Report no uncommitted changes
- If no comments found: Report diff is clean
- If file errors: Skip file and report issue