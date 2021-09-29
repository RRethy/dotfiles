local nvim = require('rrethy.nvim')
local lsp = require('lspconfig')

local M = {}

local function on_attach(client)
    vim.lsp.set_log_level("debug")
    nvim.nnoremap('\\d', function()
        vim.lsp.diagnostic.show_line_diagnostics()
    end, { 'buffer' })
    if client.supports_method('textDocument/hover') then
        nvim.nnoremap('K', function()
            vim.lsp.buf.hover()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/definition') then
        nvim.nnoremap('<c-]>', function()
            vim.lsp.buf.definition()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/typeDefinition') then
        nvim.nnoremap('gd', function()
            vim.lsp.buf.type_definition()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/formatting') then
        nvim.api.nvim_command('autocmd BufWritePre <buffer> lua vim.lsp.buf.formatting_sync(nil, 3000)')
    end
    if client.supports_method('textDocument/completion') then
        nvim.bo.omnifunc = 'v:lua.vim.lsp.omnifunc'
    end
    if client.supports_method('textDocument/signatureHelp') then
        nvim.inoremap('<c-s>', function()
            vim.lsp.buf.signature_help()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/rename') then
        nvim.nnoremap('gr', function()
            vim.lsp.buf.rename()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/implementation') then
        nvim.nnoremap('gi', function()
            vim.lsp.buf.implementation()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/references') then
        nvim.nnoremap('gu', function()
            vim.lsp.buf.references()
        end, { 'buffer' })
    end
    if client.supports_method('workspace/symbol') then
        nvim.nnoremap('<leader>s', function()
            require('telescope.builtin').lsp_dynamic_workspace_symbols()
        end, { 'buffer' })
    end
    if client.supports_method('textDocument/documentSymbols') then
        nvim.nnoremap('<leader>d', function()
            require('telescope.builtin').lsp_document_symbols()
        end, { 'buffer' })
    end
    require('illuminate').on_attach(client)
end


function M.setup(opts)
    vim.lsp.util.close_preview_autocmd = function(events, winnr)
        -- I prefer to keep the preview (especially for signature_help) open while typing in insert mode
        events = vim.tbl_filter(function(v) return v ~= 'CursorMovedI' and v ~= 'BufLeave' end, events)
        vim.api.nvim_command("autocmd "..table.concat(events, ',').." <buffer> ++once lua pcall(vim.api.nvim_win_close, "..winnr..", true)")
    end
    for name, server_opts in pairs(opts.servers) do
        if not server_opts.on_attach then
            server_opts.on_attach = on_attach
        end
        if not server_opts.flags then
            server_opts.flags = {
                debounce_text_changes = 1250,
            }
        end
        lsp[name].setup(server_opts)
    end
    for method, handler in pairs(opts.handlers) do
        vim.lsp.handlers[method] = handler
    end
end

return M
