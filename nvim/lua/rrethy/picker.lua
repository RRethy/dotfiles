local nvim = require('rrethy.nvim')

local M = {}

function M.open_ui()
    if not M.buf then
        M.buf = nvim.api.nvim_create_buf(false, true)
    end
    -- TODO check errors
    nvim.api.nvim_open_win(M.buf, false, {
        relative = 'editor',
        width = 10,
        height = 10,
        row = 2,
        col = 20,
        focusable = true,
        style = 'minimal',
    })
end

function M.show(choices)
    M.open_ui()
    nvim.api.nvim_buf_set_lines(M.buf, 0, -1, false, choices)
end

return M
