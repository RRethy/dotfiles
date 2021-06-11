local M = {}

function M.handler(_, method, result, _, bufnr, config)
    config = { border = 'single' }
    -- When use `autocmd CompleteDone <silent><buffer> lua vim.lsp.buf.signature_help()` to call signatureHelp handler
    -- If the completion item doesn't have signatures It will make noise. Change to use `print` that can use `<silent>` to ignore
    if not (result and result.signatures and result.signatures[1]) then
        print('No signature help available')
        return
    end
    local lines = vim.lsp.util.convert_signature_help_to_markdown_lines(result)
    lines = vim.lsp.util.trim_empty_lines(lines)
    if vim.tbl_isempty(lines) then
        print('No signature help available')
        return
    end
    -- I'm using 'ft' instead of 'syntax', I should look into using nested syntax
    local ft = vim.api.nvim_buf_get_option(bufnr, 'ft')
    local p_bufnr, _ = vim.lsp.util.focusable_preview(method, function()
        return lines, vim.lsp.util.try_trim_markdown_code_blocks(lines), config
    end)
    vim.api.nvim_buf_set_option(p_bufnr, 'ft', ft)
end

return M
