local api = vim.api

local M = {}

function M.toggle_opt(opt, scope)
    local on = nil
    if scope == 'win' then
        on = not api.nvim_win_get_option(0, opt)
        api.nvim_win_set_option(0, opt, on)
    elseif scope == 'global' then
        on = not api.nvim_get_option(opt)
        api.nvim_set_option(opt, on)
    elseif scope == 'buf' then
        on = not api.nvim_buf_get_option(0, opt)
        api.nvim_buf_set_option(0, opt, on)
    end
    return on
end

function M.echom_toggle_opt(opt, scope)
    local on = M.toggle_opt(opt, scope)
    if on == nil then
        return
    end

    -- Figure out printing colored text in Lua
    local hl = on and 'String' or 'Identifier'
    api.nvim_command('echohl '..hl)
    api.nvim_command('echo "\''..opt..'\'"')
    api.nvim_command('echohl None')
end

return M
