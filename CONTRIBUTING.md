# Contributing to Halal Logistics Platform

Thank you for your interest in contributing to the Halal Logistics Platform! We welcome contributions from everyone. This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### 1. Fork the Repository

1. Fork the repository to your GitHub account
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/halal-logistics-platform.git
   cd halal-logistics-platform
   ```

### 2. Set Up Development Environment

Follow the setup instructions in the main [README.md](README.md) to get the project running locally.

### 3. Create a Feature Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-fix
```

## 💻 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add proper TypeScript types for all functions and variables

### Frontend Development

- Use TypeScript for all new components
- Follow the existing component structure in `components/`
- Use Tailwind CSS classes consistently
- Add proper error handling for API calls
- Write unit tests for complex logic

### Backend Development

- Follow NestJS best practices
- Add proper validation using class-validator
- Include error handling for all endpoints
- Write unit tests for services and controllers
- Update Prisma schema if adding new models

### Database Changes

- Use Prisma migrations for database schema changes
- Test migrations on a copy of production data
- Document any breaking changes in migration descriptions

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
npm run test

# Backend test coverage
npm run test:cov
```

### Writing Tests

- Add unit tests for new features
- Test both success and error scenarios
- Mock external dependencies
- Aim for high test coverage on new code

## 📝 Documentation

- Update README files if you add new features
- Add JSDoc comments for complex functions
- Update API documentation for new endpoints
- Keep installation instructions current

## 🔄 Pull Request Process

1. **Create a Pull Request**
   - Use the GitHub interface to create a new pull request
   - Reference any related issues in the description
   - Add screenshots or demos for UI changes

2. **Pull Request Template**
   ```
   ## Description
   [Brief description of changes]

   ## Related Issues
   - Fixes #123
   - Related to #456

   ## Changes Made
   - [List of changes]
   - [Another change]

   ## Testing
   - [How you tested the changes]
   - [Any edge cases tested]

   ## Screenshots
   [If applicable, add screenshots]
   ```

3. **Code Review**
   - Address any review comments
   - Make requested changes
   - Ensure all CI checks pass

4. **Merge**
   - Once approved, your PR will be merged
   - Delete your feature branch

## 🐛 Reporting Bugs

1. **Check Existing Issues**
   - Search existing issues to avoid duplicates
   - Check if the bug has already been reported

2. **Create a Bug Report**
   - Use the GitHub issue template
   - Include detailed steps to reproduce
   - Add screenshots if applicable
   - Include environment information

3. **Bug Report Template**
   ```
   ## Bug Description
   [Clear description of the bug]

   ## Steps to Reproduce
   1. [First step]
   2. [Second step]
   3. [etc.]

   ## Expected Behavior
   [What should happen]

   ## Actual Behavior
   [What actually happens]

   ## Environment
   - OS: [e.g., Windows 10]
   - Browser: [e.g., Chrome 91]
   - Node.js version: [e.g., 18.17.0]

   ## Additional Context
   [Any other relevant information]
   ```

## 💡 Feature Requests

1. **Create a Feature Request**
   - Use the GitHub issue template for feature requests
   - Describe the feature and its benefits
   - Consider the implementation complexity

2. **Feature Request Template**
   ```
   ## Feature Description
   [Detailed description of the feature]

   ## Use Case
   [Why is this feature needed?]

   ## Proposed Solution
   [How the feature should work]

   ## Alternatives Considered
   [Other solutions considered]

   ## Additional Context
   [Any other relevant information]
   ```

## 🔒 Security

- Report security vulnerabilities privately
- Do not create public issues for security problems
- Contact the maintainers directly for security concerns

## 📞 Getting Help

- Check the documentation first
- Search existing issues and discussions
- Ask questions in GitHub discussions
- Join our community chat (if available)

## 🎯 Contribution Areas

We welcome contributions in all areas, including:

- **Frontend Development**: UI components, user experience improvements
- **Backend Development**: API endpoints, business logic, database optimizations
- **Documentation**: README updates, API documentation, user guides
- **Testing**: Unit tests, integration tests, end-to-end tests
- **DevOps**: Docker configurations, deployment scripts, CI/CD improvements
- **Design**: UI/UX improvements, accessibility enhancements

## 📜 Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) when participating in this project.

## 🙏 Acknowledgments

Thank you for contributing to the Halal Logistics Platform! Your contributions help make logistics and supply chain management more transparent and efficient.

---

**Happy coding! 🚀**
