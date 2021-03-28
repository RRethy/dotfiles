local M = {}

-- TODO logging

function M.setup()
    local opt = vim.fn.stdpath('data')..'/site/pack/backpack/opt/'
    local manifest = vim.fn.stdpath('config')..'/packmanifest.lua')
    vim.fn.mkdir(opt, 'p')
    if vim.fn.filereadable(manifest) then
        dofile(manifest)
    end
end

return M
