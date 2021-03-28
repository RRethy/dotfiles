local nvim = require('rrethy.nvim')

local terminals = {}

local M = {}

function M.open_float_term()
    local buf = terminals[nvim.fn.getcwd()]
    if not (buf and nvim.api.nvim_buf_is_loaded(buf)) then

    end

    local buf = nvim.api.nvim_create_buf(true, false)
    local win = nvim.api.nvim_open_win(buf, true, {
        relative = 'editor',
        width = vim.o.columns * 0.9,
        height = vim.o.rows * 0.9,
        row = 3,
        col = 3,
        style = 'minimal',
    })
    vim.fn.termopen(nvim.o.shell)
end

function M.close_float_term()
end

function M.toggle_float_term()
end

return M
