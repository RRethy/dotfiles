---
allowed-tools: Read, Write, Edit, MultiEdit, Glob, Grep, LS, Bash
description: Analyze and improve test coverage and quality
---

1. **Get test files from user**
   - Ask user to specify which test files to analyze
   - If user hasn't provided test files, request them

2. **Analyze existing tests**
   - Read provided test files to understand current coverage
   - Identify testing patterns and conventions used
   - Check test naming conventions
   - Look for test utilities and helpers

3. **Analyze code under test**
   - Read source files being tested
   - Identify untested functions/methods
   - Find edge cases not covered
   - Look for error handling paths

4. **Deep analysis of test quality**
   - **Coverage gaps:**
     - Missing test cases for edge conditions
     - Untested error paths
     - Missing negative test cases
     - Uncovered branches or conditions
   
   - **Test improvements:**
     - Tests that could be more specific
     - Overly complex tests that should be split
     - Missing assertions
     - Tests with unclear names or purposes
   
   - **Test removal candidates:**
     - Duplicate tests
     - Tests for deleted features
     - Tests that no longer make sense

5. **Implement improvements**
   - Add missing test cases
   - Improve existing test assertions
   - Refactor complex tests into smaller units
   - Remove redundant or obsolete tests
   - Update test descriptions for clarity

6. **Verify changes**
   - Run test suite to ensure all tests pass
   - Check test coverage if tools available
   - Ensure no regressions introduced

**Focus areas:**
- Boundary conditions and edge cases
- Error handling and exceptions
- Async operations and promises
- State mutations and side effects
- Integration points between components

**Error handling:**
- If no tests provided: Ask user for test file paths
- If tests fail: Debug and fix before proposing changes
- If no test runner: Identify appropriate test command