# blaze

## Setup steps

### backend

- Kickstart the venv

  ```shell
      uv sync
  ```

- Add env

  > Refer the `.env.sample` file for the required env

- Add MCP server config

  > to add MCP servers for chat completions, make a `mcp.json` file in the root level of the backend directory. We follow the standard set by [FastMCP](https://gofastmcp.com/clients/client#configuration-format).

  ```
  // Example
  {
      "mcpServers": {
          "assistant": { "command": "uvx", "args": ["maths-mcp"] }
      }
  }

  ```

- Run backend

  ```shell
  gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:8000 main:app
  ```

### frontend

- Step 1: `npm i`
- Step 2: `npm run dev`
