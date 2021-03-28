finish
function! LspStatus() abort
    " return '%{luaeval("vim.lsp.diagnostic.get_count(0, [[Error]])")}'
    return '%{luaeval("require([[rrethy.sandbox]]).foo()")}'
endfunction
let &statusline = LspStatus()


