---
allowed-tools: Read, Edit, MultiEdit, Grep, Glob
description: Add concise Go documentation comments for packages, functions, structs, and interfaces
---

1. **Analyze Go files**
   - Find Go files in the specified directory or use current directory
   - Use `grep` or `glob` to locate .go files
   - Skip test files (*_test.go) unless explicitly requested

2. **Identify undocumented elements**
   - Package declarations missing comments
   - Exported functions without documentation
   - Exported types (structs, interfaces) without comments
   - Exported constants and variables without documentation
   - Skip unexported (lowercase) elements

3. **Add package comments**
   - Format: `// Package <name> provides <concise purpose>`
   - Place before `package` declaration
   - Only if package does something non-obvious
   - Example: `// Package auth handles user authentication and authorization`

4. **Add function comments**
   - Format: `// FunctionName <verb> <what it does>`
   - Only for exported functions (capital first letter)
   - Skip if function name is self-explanatory (e.g., `GetID()`)
   - Examples:
     - `// Parse extracts configuration from the provided JSON data`
     - `// Validate checks if the user credentials are valid`
     - Skip: `// GetName returns the name` (obvious)

5. **Add type comments**
   - **Structs**: `// TypeName represents <what it models>`
     - Example: `// Client represents an HTTP client with retry logic`
   - **Interfaces**: `// TypeName defines <behavior/contract>`
     - Example: `// Storage defines methods for persistent data operations`
   - Skip if type name clearly describes purpose

6. **Add method comments**
   - Format: `// MethodName <verb> <action on receiver>`
   - Only for exported methods
   - Reference the receiver if behavior is specific
   - Example: `// Close terminates the connection and releases resources`

7. **Comments to avoid**
   - Don't add obvious comments: `// GetUser gets a user`
   - Don't document unexported elements
   - Don't add inline comments within functions
   - Don't repeat what the code clearly shows
   - Don't add TODO/FIXME comments

**Quality guidelines:**
- Keep comments under 80 characters when possible
- Start with the element name (Go convention)
- Use active voice and present tense
- Focus on "what" and "why", not "how"
- Omit comment if it adds no value

**Examples of good comments:**
```go
// Package cache implements an LRU cache with TTL support
package cache

// Cache manages key-value pairs with automatic expiration
type Cache struct { ... }

// Set stores a value with the specified TTL
func (c *Cache) Set(key string, value interface{}, ttl time.Duration) { ... }
```

**Examples to skip:**
```go
// GetID returns the ID (obvious - skip this)
func GetID() string { ... }

// Name is the name (redundant - skip this)
Name string
```