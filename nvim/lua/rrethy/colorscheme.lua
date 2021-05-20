local kitty = require('rrethy.kitty')
local pickers = require('telescope.pickers')
local finders = require('telescope.finders')
local conf = require('telescope.config').values
local actions = require('telescope.actions')
local action_set = require('telescope.actions.set')
local action_state = require('telescope.actions.state')

local M = {}

local function set_colorscheme(name)
    kitty.set_colors(name)
    vim.cmd('colorscheme '..name)
end

function M.picker()
    return require('telescope.builtin').colorscheme({
        attach_mappings = function()
            action_set.shift_selection:enhance({
                pre = function(_, change)
                    kitty.set_colors(change)
                end
            })
        return true
    end})
end

return M
