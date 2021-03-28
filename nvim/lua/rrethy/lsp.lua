local lsp = require('lspconfig')
local nvim = require('rrethy.nvim')
local illuminate = require('illuminate')

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

function M.setup(servers)
    if M.initialized then return end
    M.initialized = true
    for _, name in ipairs(servers) do
        M.servers[name]()
    end
end

return M
