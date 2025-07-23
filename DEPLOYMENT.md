# Deployment Guide for Content Craft v2

This guide explains how to deploy the Content Craft v2 application to Coolify.

## Prerequisites

- A running Coolify instance
- Access to your Git repository

## Deployment Steps

### 1. Push Your Code to Git

Ensure all changes, including the `Dockerfile`, `nginx.conf`, `docker-compose.yml`, and updated `vite.config.ts`, are pushed to your Git repository:

```bash
git add .
git commit -m "feat: Prepare for Docker deployment"
git push origin main
```

### 2. Create a New Application in Coolify

1. Log in to your Coolify dashboard
2. Navigate to "Applications" and click "Add New"
3. Select "Git Repository" as the source
4. Connect to your Git repository and select this project

### 3. Configure the Deployment

1. **Select Branch**: Choose the branch you want to deploy (e.g., `main`)
2. **Build Method**: Select "Docker Compose"
3. **Docker Compose File**: Enter `docker-compose.yml` (this should be detected automatically)
4. **Domain**: Enter the domain where you want to access your application

### 4. Deploy the Application

1. Click the "Deploy" button
2. Coolify will build and deploy your application

### 5. Troubleshooting

If you encounter the "port is already allocated" error:

1. Make sure your `docker-compose.yml` file does not include any port mappings
2. Ensure the `networks` section is configured correctly to use `coolify-network`
3. Redeploy the application

## Important Notes

- Coolify's reverse proxy (Traefik) handles routing traffic to your application
- The application exposes port 80 internally, but Coolify manages the external port mapping
- The `base: "./"` setting in `vite.config.ts` ensures assets are loaded correctly when deployed

## Verification

After deployment, visit your configured domain to verify that the application is working correctly.
