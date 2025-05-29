# Deployment Guide

This document describes how to use the deployment and version management scripts for the `@pucp-gidis-hiisc/esm-sihsalus-app` OpenMRS microfrontend.

## Overview

We have automated deployment and version management scripts that handle:
- Version bumping with git commits
- Building and testing before deployment
- Publishing to NPM with appropriate tags
- Git tagging for releases
- Husky pre-commit and pre-push hooks

## Scripts Available

### Version Management

```bash
# Bump patch version (7.0.0 → 7.0.1)
yarn version:patch

# Bump minor version (7.0.0 → 7.1.0)  
yarn version:minor

# Bump major version (7.0.0 → 8.0.0)
yarn version:major
```

These scripts will:
- Check that your working directory is clean
- Update the version in `package.json`
- Create a git commit with the new version
- Provide next steps for deployment

### Deployment

#### Stable Release (latest tag)
```bash
yarn deploy
```

This script will:
- Verify you're on the `main` or `master` branch
- Check that your working directory is clean
- Install dependencies
- Run verification (lint, type check, tests)
- Build the project
- Publish to NPM with the `latest` tag
- Create and push a git tag

#### Pre-release (next tag)
```bash
yarn deploy:next
```

This script will:
- Generate a pre-release version with timestamp and commit hash
- Install dependencies
- Run verification (lint, type check, tests)
- Build the project
- Publish to NPM with the `next` tag
- Reset package.json to original version

## Workflow

### For Regular Development

1. Make your changes
2. Commit your changes (Husky will run pre-commit checks)
3. Push your changes (Husky will run pre-push checks)

### For Releases

#### Patch Release (Bug fixes)
```bash
# 1. Update version
yarn version:patch

# 2. Push the version commit
git push origin main

# 3. Deploy to NPM
yarn deploy
```

#### Minor/Major Release
```bash
# 1. Update version
yarn version:minor  # or yarn version:major

# 2. Push the version commit  
git push origin main

# 3. Deploy to NPM
yarn deploy
```

#### Pre-release Testing
```bash
# Deploy current state as pre-release
yarn deploy:next

# Test the pre-release
npm install @pucp-gidis-hiisc/esm-sihsalus-app@next
```

## Husky Git Hooks

### Pre-commit Hook
Runs automatically before each commit:
- ESLint with auto-fix
- Prettier formatting
- Type checking

### Pre-push Hook  
Runs automatically before each push:
- Full verification (lint, type check, tests)
- Build verification

## CI/CD Integration

The GitHub Actions workflow automatically:

### On Push to Main
- Builds the project
- Runs verification
- Publishes a pre-release version with `next` tag

### On Release Creation
- Builds the project
- Publishes the stable version with `latest` tag

## NPM Package Information

- **Package**: `@pucp-gidis-hiisc/esm-sihsalus-app`
- **Registry**: https://www.npmjs.com/package/@pucp-gidis-hiisc/esm-sihsalus-app
- **Latest**: `npm install @pucp-gidis-hiisc/esm-sihsalus-app`
- **Next**: `npm install @pucp-gidis-hiisc/esm-sihsalus-app@next`

## Troubleshooting

### Common Issues

1. **Working directory not clean**
   ```bash
   git status
   git add .
   git commit -m "commit message"
   ```

2. **NPM authentication failed**
   - Ensure `NPM_AUTH_TOKEN` is set in GitHub secrets
   - For local deployment, ensure you're logged in: `npm login`

3. **Build failed**
   - Check linting errors: `yarn lint`
   - Check type errors: `yarn typescript`
   - Check tests: `yarn test`

4. **Git hooks not working**
   ```bash
   yarn prepare  # Reinstall husky hooks
   ```

### Manual NPM Commands

If you need to publish manually:

```bash
# Build first
yarn build

# Publish latest
yarn npm publish --access public --tag latest

# Publish next
yarn npm publish --access public --tag next
```

## Security Notes

- Never commit NPM tokens to the repository
- Use GitHub secrets for CI/CD authentication
- Always verify builds before publishing
- Use pre-releases for testing before stable releases
