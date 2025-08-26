---
allowed-tools: Read, Edit, MultiEdit, Grep, TodoWrite
description: Find and implement TODO comments in the specified file
---

1. **Read the target file**
   - Read the file at the specified path
   - If no path provided, ask user to specify a file

2. **Find TODO comments**
   - Search for TODO patterns:
     - `// TODO:` or `// TODO(`
     - `/* TODO:` or `/* TODO(`
     - `# TODO:` (for scripts/configs)
   - Extract the TODO description and context
   - Note the line number and surrounding code

3. **Create task list**
   - Use TodoWrite to track each TODO found
   - Format: "Implement: [TODO description] at line X"
   - Mark first task as in_progress
   - Order by line number or logical dependencies

4. **Implement each TODO**
   - For each TODO in the file:
     - Understand the context and requirements
     - Implement the requested functionality
     - Remove the TODO comment after implementation
     - **DO NOT add any new comments**
     - Mark task as completed in TodoWrite
     - Move to next task

5. **Implementation guidelines**
   - Write clean, self-documenting code
   - Use descriptive variable and function names
   - Follow existing code patterns in the file
   - No explanatory comments - code should be clear
   - No "helpful" comments about what was done
   - Just implement the functionality

6. **Verify implementation**
   - Ensure all TODOs are addressed
   - Check that no TODO comments remain
   - Confirm no new comments were added
   - Run any obvious validation (compile check, etc.)

7. **Summary**
   - Report number of TODOs implemented
   - List what was done (briefly)
   - Note if any TODOs couldn't be implemented and why

**Important rules:**
- DO NOT add any code comments while implementing
- Remove TODO comments after implementing them
- Keep code self-explanatory through good naming
- If TODO is unclear, make reasonable assumptions
- If TODO requires external dependencies, note it

**Example transformations:**
```go
// Before:
// TODO: Add validation for email format
func SaveUser(email string) error {
    return db.Save(email)
}

// After (no comments added):
func SaveUser(email string) error {
    if !isValidEmail(email) {
        return ErrInvalidEmail
    }
    return db.Save(email)
}
```
