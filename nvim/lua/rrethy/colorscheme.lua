local colorscheme = require('colorscheme')
local kitty = require('rrethy.kitty')
local nvim = require('rrethy.nvim')
local notif = require('rrethy.notification')

local M = {}

function M.set_theme(name)
    kitty.set_colors(name)
    colorscheme.setup(name)
    notif.notify(name)
    M.cur = name
end

function M.setup(opts)
    M.cur = opts.initial_theme
    M.themes = opts.themes
    M.nthemes = #opts.themes
    vim.tbl_add_reverse_lookup(M.themes)
    colorscheme.setup(M.cur)
    kitty.set_colors(M.cur)

    nvim.nnoremap('<c-f>', function()
        local next_theme = M.themes[(M.themes[M.cur] % M.nthemes) + 1]
        M.set_theme(next_theme)
    end)
    nvim.nnoremap('<c-b>', function()
        local next_theme = M.themes[((M.themes[M.cur] - 2) % M.nthemes) + 1]
        M.set_theme(next_theme)
    end)
end

return M
