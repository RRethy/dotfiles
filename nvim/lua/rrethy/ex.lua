local M = {}

M.highlight = setmetatable({}, {
    __newindex = function(tbl, hlgroup, args)
        local guifg, guibg, gui, guisp = args.guifg, args.guibg, args.gui, args.guisp
        local cmd = {'hi', hlgroup}
        if guifg then table.insert(cmd, 'guifg='..guifg) end
        if guibg then table.insert(cmd, 'guibg='..guibg) end
        if gui then table.insert(cmd, 'gui='..gui) end
        if guisp then table.insert(cmd, 'guisp='..guisp) end
        vim.cmd(table.concat(cmd, ' '))
    end
})

M.command = setmetatable({}, {
    __newindex = function(tbl, cmdname, action)
        local cmd = {'command!'}
        vim.cmd(table.concat(cmd, ' '))
    end
})

return M
