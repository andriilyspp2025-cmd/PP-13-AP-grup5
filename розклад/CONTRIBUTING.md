# Contributing to Rozklad

Thank you for your interest in contributing to Rozklad! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check if the bug has already been reported
2. Use the latest version to verify the bug still exists
3. Collect information about your environment

Create a detailed bug report including:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

### Suggesting Features

Feature suggestions are welcome! Include:
- Clear use case
- Detailed description
- Why this feature would be useful
- Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/rozklad.git
   cd rozklad
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for changes to existing features
   - `Remove:` for removed features
   - `Docs:` for documentation changes
   - `Style:` for formatting changes
   - `Refactor:` for code refactoring
   - `Test:` for adding tests
   - `Chore:` for maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Link related issues
   - Ensure all tests pass

## Development Setup

### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dev dependencies

# Run tests
pytest

# Run linter
flake8 app/
black app/ --check

# Format code
black app/
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run lint -- --fix
```

### Mobile Development

```bash
cd mobile

# Install dependencies
npm install

# Start development server
npm start
```

## Code Style Guidelines

### Python (Backend)

- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use Black for formatting
- Write docstrings for functions/classes

Example:
```python
def calculate_schedule_conflicts(
    schedule_entry: ScheduleEntry,
    db: Session
) -> List[ScheduleEntry]:
    """
    Check for scheduling conflicts.
    
    Args:
        schedule_entry: The schedule entry to check
        db: Database session
        
    Returns:
        List of conflicting schedule entries
    """
    # Implementation
    pass
```

### TypeScript (Frontend/Mobile)

- Use TypeScript strict mode
- Follow Airbnb style guide
- Use functional components with hooks
- Prefer named exports
- Maximum line length: 100 characters

Example:
```typescript
interface ScheduleEntryProps {
  entry: ScheduleEntry
  onEdit?: (id: number) => void
}

export function ScheduleEntryCard({ entry, onEdit }: ScheduleEntryProps) {
  // Implementation
}
```

### Component Structure

React components should follow this structure:
1. Imports
2. Type definitions
3. Component definition
4. Hooks (useState, useEffect, etc.)
5. Event handlers
6. Render logic
7. Styles (if using CSS-in-JS)

### API Design

- Use RESTful conventions
- Version your API (/api/v1/...)
- Use appropriate HTTP methods
- Return meaningful status codes
- Include proper error messages

## Testing Guidelines

### Backend Tests

```python
def test_create_schedule_entry():
    """Test creating a new schedule entry."""
    # Arrange
    data = {...}
    
    # Act
    response = client.post("/api/v1/schedule", json=data)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["subject_name"] == "Math"
```

### Frontend Tests

```typescript
describe('ScheduleCard', () => {
  it('displays schedule information correctly', () => {
    render(<ScheduleCard entry={mockEntry} />)
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
  })
})
```

### Test Coverage

- Aim for at least 80% code coverage
- Test edge cases and error conditions
- Write integration tests for critical flows

## Documentation

- Update README.md if needed
- Document new features in FEATURES.md
- Update API documentation
- Add inline comments for complex logic
- Update setup instructions if dependencies change

## Database Migrations

When changing database models:

```bash
# Create migration
alembic revision --autogenerate -m "Add new field to schedule"

# Review the migration file
# Edit if necessary

# Apply migration
alembic upgrade head
```

## Performance Considerations

- Optimize database queries
- Use pagination for large datasets
- Implement caching where appropriate
- Lazy load images and components
- Profile and benchmark critical paths

## Security Considerations

- Validate all inputs
- Sanitize user data
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines
- Never commit secrets or credentials

## Review Process

1. Automated checks must pass:
   - Tests
   - Linting
   - Type checking
   - Build process

2. Code review by maintainers
3. Address feedback
4. Approval and merge

## Getting Help

- Read existing documentation
- Check closed issues for similar problems
- Ask questions in discussions
- Join our community chat (if available)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Mentioned in project documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?

Feel free to reach out:
- GitHub Issues: For bug reports and feature requests
- GitHub Discussions: For questions and general discussion
- Email: contribute@rozklad.com

Thank you for contributing to Rozklad! 🎉

