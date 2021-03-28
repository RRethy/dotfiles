local uv = vim.loop

local M = {}

function M.setup2()
    local pipe = uv.new_pipe(true)
    pipe:bind('unix:/tmp/nvim-sourcerer')
    pipe:listen(128, function()

    end)
end

return M
