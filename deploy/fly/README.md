# Fly.io

Use `fly.toml` in this directory as the base config for Fly deployments.

```bash
fly launch --copy-config --config deploy/fly/fly.toml
fly deploy -c deploy/fly/fly.toml
```

Set secrets with `fly secrets set KEY=value`.
