-- resolved_capabilities = {
-- call_hierarchy = true,
-- code_action = <3>{
-- codeActionKinds = { "", "quickfix", "refactor", "refactor.extract", "refactor.inline", "refactor.rewrite" },
-- resolveProvider = true
-- },
-- code_lens = true,
-- code_lens_resolve = true,
-- completion = true,
-- declaration = false,
-- document_formatting = true,
-- document_highlight = true,
-- document_range_formatting = false,
-- document_symbol = true,
-- execute_command = false,
-- find_references = true,
-- goto_definition = true,
-- hover = true,
-- implementation = true,
-- rename = true,
-- signature_help = true,
-- signature_help_trigger_characters = <4>{ "(", "," },
-- text_document_did_change = 2,
-- text_document_open_close = true,
-- text_document_save = <5>{},
-- text_document_save_include_text = false,
-- text_document_will_save = false,
-- text_document_will_save_wait_until = false,
-- type_definition = true,
-- workspace_folder_properties = {
-- changeNotifications = false,
-- supported = false
-- },
-- workspace_symbol = true
-- },
local lsp = require('lspconfig')
local nvim = require('rrethy.nvim')
local illuminate = require('illuminate')
local join_lines = require('rrethy.join_lines')

local M = {}

M.methods = {}

M.methods.hover = function()
    nvim.nnoremap('K', '<cmd>lua vim.lsp.buf.hover()<cr>')
end

M.methods.definition = function()
    nvim.nnoremap('<c-]>', '<cmd>lua vim.lsp.buf.definition()<cr>')
end

M.methods.formatting = function()
    nvim.api.nvim_command [[ autocmd BufWritePre <buffer> lua vim.lsp.buf.formatting_sync(nil, 3000) ]]
end

M.methods.document_highlight = function()
    illuminate.on_attach()
end

M.methods.document_color = function()
    -- require'hexokinase'.on_attach()
end

M.methods.completion = function()
    nvim.bo.omnifunc = 'v:lua.vim.lsp.omnifunc'
end

M.methods.signature_help = function()
    vim.cmd('syntax enable') -- TODO tree-sitter is being naughty
    nvim.inoremap('<c-s>', function()
        vim.lsp.buf.signature_help()
    end)
end

M.methods.rename = function()
    nvim.nnoremap('<leader>r', function()
        vim.lsp.buf.rename()
    end)
end

M.methods.join_lines = function()
    nvim.nnoremap('J', function()
        join_lines.join_lines()
    end)
end

M.servers = {}

M.servers.sumneko_lua = function(config)
    local sumneko_dir = nvim.env.HOME..'/lua/lua-language-server'
    lsp.sumneko_lua.setup {
        cmd = {
            sumneko_dir..'/bin/macOS/lua-language-server',
            '-E',
            sumneko_dir..'/main.lua',
        },
        settings = {
            Lua = {
                runtime = {
                    version = 'LuaJIT',
                    path = nvim.split(package.path, ";"),
                },
                diagnostics = {
                    enable = true,
                    globals = {'vim', 'describe', 'it', 'before_each', 'after_each', 'teardown', 'pending', 'bit'},
                },
            },
        },
        on_attach = function()
           M.methods.hover()
           M.methods.definition()
           M.methods.completion()
           M.methods.document_highlight()
        end
    }
end

M.servers.rust_analyzer = function(config)
    lsp.rust_analyzer.setup {
        settings = {
            ["rust-analyzer"] = {
                cargo = {
                    loadOutDirsFromCheck = true
                },
                procMacro = {
                    enable = true
                },
            },
        },
        on_attach = function()
            M.methods.hover()
            M.methods.definition()
            M.methods.completion()
            M.methods.formatting()
            M.methods.document_highlight()
            M.methods.signature_help()
            M.methods.rename()
            M.methods.join_lines()
        end
    }
end

M.servers.gopls = function()
    lsp.gopls.setup {
        on_attach = function()
            M.methods.hover()
            M.methods.definition()
            M.methods.completion()
            M.methods.formatting()
            M.methods.document_highlight()
            M.methods.signature_help()
            M.methods.rename()
        end
    }
end

M.servers.dartls = function()
    lsp.dartls.setup {
        init_options = {
            closingLabels = true,
        },
        on_attach = function()
            M.methods.hover()
            M.methods.definition()
            M.methods.completion()
            M.methods.formatting()
            M.methods.document_highlight()
        end,
    }
end

M.servers.cssls = function()
    lsp.cssls.setup {
        on_attach = function()
            M.methods.hover()
            M.methods.definition()
            M.methods.completion()
            M.methods.formatting()
            M.methods.document_highlight()
            M.methods.document_color()
        end
    }
end

M.servers.jsonls = function()
    lsp.jsonls.setup {
        on_attach = function()
            M.methods.hover()
            M.methods.definition()
            M.methods.completion()
            M.methods.formatting()
            M.methods.document_highlight()
        end
    }
end

M.servers.vimls = function()
    lsp.vimls.setup {
        on_attach = function()
            M.methods.hover()
            M.methods.definition()
            M.methods.completion()
            M.methods.document_highlight()
        end
    }
end

M.servers.clangd = function()
    lsp.clangd.setup {
        on_attach = function()
            M.methods.completion()
            M.methods.document_highlight()
        end
    }
end

function M.setup(servers)
    if M.initialized then return end
    M.initialized = true
    for _, name in ipairs(servers) do
        M.servers[name]()
    end
end

return M
