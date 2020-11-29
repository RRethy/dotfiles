local nvim_lsp = require 'nvim_lsp'
nvim_lsp.rls.setup {}
nvim_lsp.gopls.setup {}
nvim_lsp.pyls.setup {}
-- nvim_lsp.solargraph.setup{}
-- local gopls_root_pattern = require'nvim_lsp/util'.root_pattern('go.mod', '.git')
-- local abspath = vim.loop.fs_realpath
-- local gopath = abspath(vim.env.GOPATH)
-- local function find_go_project(bufpath)
-- Make it an absolute path.
-- bufpath = abspath(bufpath)
-- if vim.startswith(bufpath, gopath) then
--     return bufpath:match("(.*/go/src/[^/]+/[^/]+/[^/]+)")
-- end
-- end

-- require'nvim_lsp'.gopls.setup {
-- root_dir = function(bufpath, bufnr)
--     return gopls_root_pattern(bufpath) or find_go_project(bufpath)
-- end;
-- }
