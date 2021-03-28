local M = {}

function M.foo()
    return '%!luaeval("require([[rrethy.sandbox]]).bar()")'
end

function M.bar()
    return '%{luaeval("require([[rrethy.sandbox]]).baz()")}'
end

function M.baz()
    return tostring(vim.fn.winbufnr(vim.g.statusline_winid))
end

return M
