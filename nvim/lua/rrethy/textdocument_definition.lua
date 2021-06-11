local M = {}

function M.handler(_, method, result)
    if result == nil or vim.tbl_isempty(result) then
        local _ = require('vim.lsp.log').info() and require('vim.lsp.log').info(method, 'No location found')
        return nil
    end

    if vim.tbl_islist(result) then
        vim.lsp.util.jump_to_location(result[1])
        if #result > 1 then
            vim.lsp.util.set_loclist(vim.lsp.util.locations_to_items(result))
            vim.api.nvim_command("lopen")
            vim.api.nvim_command("wincmd p")
        end
    else
        vim.lsp.util.jump_to_location(result)
    end
end

return M
