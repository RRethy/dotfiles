local M = {}

-- TODO:
-- clear once moving it up would put it off screen
-- global configuration rather than invokation configuration
-- less generic (preset types like normal, error, info, warn, hint)
-- check the vim api for popup.txt
-- check neovim-ui
-- scope animation to tab
-- allow for buffer scoped notification
-- animate movement up (maybe an animation library similar ValueAnimator)

-- TODO gotta scope this to tab
local floats = {}

local function move_floats(dy)
    for win, _ in pairs(floats) do
        local config = vim.api.nvim_win_get_config(win)
        config.row = config.row[false] + dy
        vim.api.nvim_win_set_config(win, config)
    end
end

function M.notify(msgs, opts)
    if #msgs == 0 then return end

    if type(msgs) == 'string' then
        msgs = { msgs }
    end

    local max = 0
    for _, line in pairs(msgs) do
        if #line > max then
            max = #line
        end
    end

    local topborder = '╭'..string.rep('─', max)..'╮'
    local middle = '│'..string.rep(' ', max)..'│'
    local botborder = '╰'..string.rep('─', max)..'╯'
    local border = {topborder}
    for _ = 1, #msgs do table.insert(border, middle) end
    table.insert(border, botborder)

    local buf = vim.api.nvim_create_buf(false, true)
    vim.api.nvim_buf_set_lines(buf, 0, -1, false, border)
    vim.api.nvim_buf_set_text(buf, 1, 3, #msgs, max + 3, msgs)

    local height = #msgs + 2
    local width = max + 2
    local row = vim.o.lines - 3 - height
    local col = vim.o.columns - width - 1
    local win = vim.api.nvim_open_win(buf, false, {
        relative = 'editor',
        height = height,
        width = width,
        row = row,
        col = col,
        style = 'minimal',
    })
    vim.api.nvim_win_set_option(win, 'winhighlight', 'NormalFloat:MoreMsg')

    move_floats(-height)

    floats[win] = 1

    vim.defer_fn(function()
        floats[win] = nil
        vim.api.nvim_win_close(win, true)
        vim.api.nvim_buf_delete(buf, { force = true })
    end, 3000)
end

return M
