# Contributing to Adaptive Wellness AI

Thank you for your interest in contributing to Adaptive Wellness AI! This document provides guidelines for contributing to the project.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints

---

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template**
3. **Include**:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing feature requests**
2. **Open a discussion** before creating a PR
3. **Explain**:
   - Use case and motivation
   - Proposed solution
   - Alternatives considered
   - Impact on existing features

### Pull Requests

#### Before You Start

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Discuss major changes** in an issue first

#### Development Workflow

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/adaptive-wellness-ai.git
cd adaptive-wellness-ai

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Run tests (when available)
npm test

# Commit with clear messages
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a pull request
```

#### PR Guidelines

- **One feature per PR**: Keep changes focused
- **Write clear commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
- **Update documentation**: If you change APIs or add features
- **Add tests**: For new features (when test suite exists)
- **Follow code style**: Use ESLint and Prettier

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(agents): add nutrition tracking agent
fix(auth): resolve Google OAuth callback error
docs(readme): update setup instructions
refactor(monitoring): optimize database queries
```

---

## Development Guidelines

### Code Style

- **TypeScript**: Use strict mode
- **Naming**: 
  - Components: PascalCase (`GoalCard`)
  - Functions: camelCase (`fetchUserGoals`)
  - Constants: UPPER_CASE (`MAX_GOALS`)
- **Formatting**: Run `npx prettier --write .` before committing

### File Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
├── lib/             # Core logic
│   ├── agents/      # AI agents
│   ├── auth.ts      # Auth config
│   └── utils.ts     # Utilities
└── types/           # TypeScript types
```

### Agent Development

When adding a new agent:

```typescript
// 1. Create agent class
export class YourAgent extends BaseAgent {
  constructor() {
    super('your-agent', `Your specialized system prompt...`);
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    // Implementation
  }
}

// 2. Register in orchestrator
const agents = new Map([
  // ...
  ['your-agent', new YourAgent()],
]);

// 3. Add API route
// src/app/api/your-feature/route.ts

// 4. Update types if needed
```

### Database Changes

When modifying the database schema:

```bash
# 1. Edit schema
# Edit prisma/schema.prisma

# 2. Generate migration (production)
npm run db:migrate

# OR push directly (development)
npm run db:push

# 3. Update seed data if needed
# Edit prisma/seed.ts
```

---

## Testing

### Current Status

Testing infrastructure is planned. When available:

```bash
# Run all tests
npm test

# Run specific test
npm test -- agents.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Requirements

- All new agents must have unit tests
- API routes should have integration tests
- Critical user flows need E2E tests

---

## Documentation

### What to Document

- **New Features**: Update README.md
- **API Changes**: Update inline comments
- **Architecture Changes**: Update ARCHITECTURE.md
- **Setup Changes**: Update SETUP.md

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex concepts
- Keep it up to date with code

---

## Review Process

### For Contributors

1. Submit PR with clear description
2. Link related issues
3. Wait for review (usually 2-3 days)
4. Address feedback
5. Get approval from maintainer
6. PR merged 🎉

### For Reviewers

- Be constructive and kind
- Focus on code quality and project fit
- Check for security issues
- Verify documentation is updated
- Test locally if possible

---

## Areas Needing Contribution

### High Priority

- [ ] Comprehensive test suite
- [ ] Mobile-responsive design improvements
- [ ] Performance optimizations (LLM caching)
- [ ] Additional wellness domains (nutrition, sleep)

### Medium Priority

- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Accessibility (WCAG compliance)
- [ ] PWA support for offline mode

### Low Priority

- [ ] Social features (share progress)
- [ ] Gamification elements
- [ ] Integration with fitness trackers
- [ ] Export data functionality

---

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an issue with the bug template
- **Security**: Email security@yourproject.com (do NOT open public issue)

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Adaptive Wellness AI better! 🚀
