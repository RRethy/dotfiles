local color = require 'rrethy.color'
local hotline = require'rrethy.hotline'

local base16 = color.base16

local tabnames = {}

vim.cmd [[command! -nargs=1 TabRename lua require'rrethy.tabline'.rename_tab(<f-args>)]]

hotline.tabline {
    function()
        local tabs = {}
        for nr, handle in ipairs(vim.api.nvim_list_tabpages()) do
            local hl
            if handle == vim.api.nvim_get_current_tabpage() then
                hl = 'TabLineSel'
            else
                hl = 'TabLine'
            end

            local label = {' ', tostring(nr)}
            if tabnames[handle] ~= nil then
                table.insert(label, string.format(': %s', tabnames[handle]))
            end
            table.insert(label, ' ')

            table.insert(tabs, {
                highlight = hl,
                table.concat(label)
            })
        end
        return tabs
    end,
    {
        highlight = 'TabLineFill',
        '%=',
    },
    function()
        local branch = vim.fn.FugitiveStatusline()
        if #branch > 0 then
            return {
                {
                    highlight = {
                        fg = base16['07'],
                        bg = color.black,
                    },
                    '',
                },
                {
                    highlight = {
                        fg = base16['00'],
                        bg = base16['07'],
                    },
                    string.format(' %s ', branch),
                },
            }
        else
            return ''
        end
    end,
}

local M = {}

function M.rename_tab(name)
    tabnames[vim.api.nvim_get_current_tabpage()] = name
    vim.cmd('redrawtabline')
end

return M
