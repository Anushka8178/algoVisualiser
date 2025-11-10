# Contributing to Algorithm Visualizer

Thank you for your interest in contributing to Algorithm Visualizer!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow the project's coding standards
- Test your changes before submitting

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/algoVisualiser.git
   cd algoVisualiser
   ```

3. **Set up the development environment:**
   - Follow [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
   - Install dependencies for both frontend and backend
   - Configure your `.env` file

4. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Auto-reloads on file changes
```

**Frontend:**
```bash
npm run dev  # Hot module replacement
```

### Making Changes

1. Make your changes
2. Test thoroughly
3. Ensure no console errors
4. Test on different browsers if possible

### Testing

- Test all affected features
- Check for console errors
- Verify database operations work correctly
- Test responsive design on mobile/desktop

## 📝 Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (where consistent)
- Add semicolons
- Use camelCase for variables/functions
- Use PascalCase for components

### File Structure

- Keep components in `src/components/`
- Keep pages in `src/pages/`
- Keep utilities in `src/utils/` or `backend/utils/`
- Keep models in `backend/models/`

## 📤 Commit Guidelines

### Commit Message Format

```
type: short description

Longer description if needed
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add linear search visualization

fix: resolve drag detection issue in Dijkstra

docs: update setup instructions

style: format code with prettier
```

## 🔀 Pull Request Process

1. **Update your branch:**
   ```bash
   git pull origin main
   ```

2. **Push your changes:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request:**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots if UI changes
   - Ensure all checks pass

4. **Respond to feedback:**
   - Address review comments
   - Make requested changes
   - Keep the PR updated

## 🐛 Reporting Issues

When reporting bugs, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

## ✨ Feature Requests

For new features:

- Describe the feature clearly
- Explain the use case
- Provide examples if possible
- Consider implementation complexity

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [D3.js Tutorial](https://d3js.org/)

---

**Thank you for contributing! 🎉**

