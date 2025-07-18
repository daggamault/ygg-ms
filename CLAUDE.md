# Code Standards

- Keep code minimal and clean
- Prefer arrow functions
- No comments unless absolutely necessary
- Omit braces unless necessary
- No unused variables or imports
- No superfluous code
- Concise and sensible variable and function names
- Always use latest ES features and syntax
- Keep exports inline to avoid extra export statements
- Destructure where possible
- API responses use status codes only - UI handles messages

## Important Instruction Reminders

Do what has been asked; nothing more, nothing less. Pay attention to existing patterns and architecture and ensure you follow it.

## Environment Variables

- Never use fallback values for environment variables - fail fast instead
- Missing environment variables should cause the application to crash with a clear error
- Use explicit validation for required environment variables at startup
